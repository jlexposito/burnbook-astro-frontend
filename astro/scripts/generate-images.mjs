import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import pLimit from "p-limit";

import { IMAGE_CONFIG } from "../src/utils/images/imageConfig.ts";

const INPUT_DIR = "./public/originals";
const OUTPUT_DIR = "./public/generated";
const MANIFEST_PATH = "./src/image-manifest.json";

const CONCURRENCY = 10;

const FORMATS = IMAGE_CONFIG.formats;
const SIZES = IMAGE_CONFIG.sizes;

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

function outputPath(file, hash, size, format) {
  const base = file.replace(/\.[^/.]+$/, "");

  return path.join(
    OUTPUT_DIR,
    format,
    String(size),
    `${base}.${hash}.${size}.${format}`
  );
}

/**
 * =========================================================
 * IMAGE GENERATION
 * =========================================================
 */

async function generateVariant(image, output, size, format) {
  ensureDir(path.dirname(output));

  let pipeline = image.clone().resize({
    height: size,
    withoutEnlargement: true,
  });

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
  const generatedSizes = [];

  for (const size of SIZES) {
    if (metadata.height && size > metadata.height) continue;

    generatedSizes.push(size);

    for (const format of FORMATS) {
      const output = outputPath(file, hash, size, format);

      if (!shouldBuild(inputPath, output)) {
        console.log(`↷ Skip ${path.basename(output)}`);
        continue;
      }

      tasks.push(generateVariant(image, output, size, format));
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