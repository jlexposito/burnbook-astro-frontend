import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

//const INPUT_DIR = "./src/assets/originals";
const INPUT_DIR = "./public/originals";
const OUTPUT_DIR = "./public/generated";
const MANIFEST_PATH = "./src/image-manifest.json";

const WIDTHS = [480, 768, 1280];
const FORMATS = ["avif", "webp"];

async function hashFile(filePath) {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 10);
}

async function loadManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST_PATH, "utf-8"));
  } catch {
    return {};
  }
}

async function saveManifest(manifest) {
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function processImage(file, manifest) {
  const inputPath = path.join(INPUT_DIR, file);

  const hash = await hashFile(inputPath);

  // filename WITH extension stays the key
  if (manifest[file]?.hash === hash) {
    console.log(`⏭ skip ${file}`);
    return;
  }

  console.log(`⚙️ processing ${file}`);

  const entry = {
    hash,
    sizes: WIDTHS,
    formats: FORMATS,
    aspectRatio: null,
    lcp: false
  };

  const meta = await sharp(inputPath).metadata();
  if (meta.width && meta.height) {
    entry.aspectRatio = meta.width / meta.height;
  }

  const baseName = path.parse(file).name;

  for (const format of FORMATS) {
    for (const width of WIDTHS) {
      const dir = path.join(OUTPUT_DIR, format, String(width));
      await ensureDir(dir);

      const outputFile = `${baseName}.${hash}.${width}.${format}`;

      await sharp(inputPath)
        .resize(width)
        .toFormat(format === "webp" ? "webp" : "avif", {
          quality: format === "webp" ? 80 : 60
        })
        .toFile(path.join(dir, outputFile));
    }
  }

  manifest[file] = entry;
}

async function main() {
  await ensureDir(OUTPUT_DIR);

  const manifest = await loadManifest();

  const files = (await fs.readdir(INPUT_DIR))
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

  for (const file of files) {
    await processImage(file, manifest);
  }

  await saveManifest(manifest);

  console.log("✅ done");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});