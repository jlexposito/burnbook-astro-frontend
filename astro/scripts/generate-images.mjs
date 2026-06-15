import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import pLimit from "p-limit";
import os from "os";


import { IMAGE_CONFIG } from "../src/utils/images/imageConfig.ts";

const INPUT_DIR = process.env.ASSET_CACHE_DIR || "./.cache/originals";
const OUTPUT_DIR = "./public/generated";
const MANIFEST_PATH = "./src/image-manifest.json";

function getConcurrency() {
  const cores = os.cpus()?.length || 4;

  if (process.env.CI) {
    return Math.max(2, Math.floor(cores / 2));
  }

  return Math.max(4, cores - 1);
}

const CONCURRENCY = getConcurrency();

const FORMATS = IMAGE_CONFIG.formats;

// Expecting IMAGE_CONFIG.sizes to look like: { height: [180, 220], width: [320, 640] }
const HEIGHT_SIZES = IMAGE_CONFIG.sizes.height || IMAGE_CONFIG.sizes || [];
const WIDTH_SIZES = IMAGE_CONFIG.sizes.width || [];

/**
 * =========================================================
 * HELPERS
 * =========================================================
 */

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function hashFile(filepath) {
  const buffer = fs.readFileSync(filepath);

  return crypto
    .createHash("md5")
    .update(buffer)
    .digest("hex")
    .slice(0, 10);
}

function fileExists(filepath) {
  return fs.existsSync(filepath);
}

function shouldBuild(inputPath, outputPath) {
  if (!fileExists(outputPath)) return true;

  const inputTime = fs.statSync(inputPath).mtimeMs;
  const outputTime = fs.statSync(outputPath).mtimeMs;

  return inputTime > outputTime;
}

// Map the short key ('h'/'w') to the exact folder names you want ('height'/'width')
function outputPath(file, hash, size, format, dimension) {
  const base = file.replace(/\.[^/.]+$/, "");
  const dimensionFolder = dimension === "h" ? "height" : "width";

  return path.join(
    OUTPUT_DIR,
    format,
    dimensionFolder, // Becomes "height" or "width" literal folder
    String(size),
    `${base}.${hash}.${size}.${format}`
  );
}

/**
 * =========================================================
 * IMAGE GENERATION
 * =========================================================
 */

async function generateVariant(image, output, size, format, dimension) {
  ensureDir(path.dirname(output));

  const resizeOptions = {
    withoutEnlargement: true,
  };

  if (dimension === "h") {
    resizeOptions.height = size;
  } else {
    resizeOptions.width = size;
  }

  let pipeline = image.clone().resize(resizeOptions);

  switch (format) {
    case "avif":
      pipeline = pipeline.avif({ quality: 55, effort: 4 });
      break;
    case "webp":
      pipeline = pipeline.webp({ quality: 75 });
      break;
    case "jpeg":
      pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
      break;
  }

  await pipeline.toFile(output);

  console.log(`✔ ${path.basename(output)}`);
}

/**
 * =========================================================
 * PROCESS IMAGE
 * =========================================================
 */

async function processImage(file) {
  const inputPath = path.join(INPUT_DIR, file);

  if (!fs.statSync(inputPath).isFile()) return null;

  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return null;

  const hash = hashFile(inputPath);

  const image = sharp(inputPath, { limitInputPixels: false });
  const metadata = await image.metadata();

  const tasks = [];

  // 1. Process Height-constrained Targets ('h' -> goes to "height" folder)
  for (const size of HEIGHT_SIZES) {
    if (metadata.height && size > metadata.height) continue;

    for (const format of FORMATS) {
      const heightOutput = outputPath(file, hash, size, format, "h");

      if (!shouldBuild(inputPath, heightOutput)) {
        console.log(`↷ Skip ${path.basename(output)}`);
        continue;
      }

      tasks.push(generateVariant(image, heightOutput, size, format, "h"));

      const widthOutput = outputPath(file, hash, size, format, "w");
      tasks.push(generateVariant(image, widthOutput, size, format, "w"));
    }
  }

  // 2. Process Width-constrained Targets ('w' -> goes to "width" folder)
  for (const size of WIDTH_SIZES) {
    if (metadata.width && size > metadata.width) continue;

    for (const format of FORMATS) {
      const output = outputPath(file, hash, size, format, "w");

      if (!shouldBuild(inputPath, output)) {
        console.log(`↷ Skip ${path.basename(output)}`);
        continue;
      }

      tasks.push(generateVariant(image, output, size, format, "w"));
    }
  }

  await Promise.all(tasks);

  return {
    [file]: {
      hash,
    },
  };
}

/**
 * =========================================================
 * MAIN
 * =========================================================
 */

async function run() {
  ensureDir(OUTPUT_DIR);
  ensureDir(path.dirname(MANIFEST_PATH));

  const files = fs.readdirSync(INPUT_DIR);

  console.log(`Found ${files.length} files`);

  const limit = pLimit(CONCURRENCY);

  const results = await Promise.all(
    files.map((file) => limit(() => processImage(file)))
  );

  const manifest = {};

  for (const result of results) {
    if (!result) continue;
    Object.assign(manifest, result);
  }

  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(manifest, null, 2)
  );

  console.log("\n✅ Manifest + images generated");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});