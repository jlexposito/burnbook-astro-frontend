import manifest from "@src/image-manifest.json";
import { IMAGE_CONFIG } from "./imageConfig";
import { IMAGE_SLOTS, type ImageSlot } from "./imageSlots";

const stripExt = (filename: string) : string => {
  return filename.replace(/\.[^/.]+$/, "");
}
const normalizeFilename = (input: string): string => {
  return input
    .split("?")[0]           // remove query params if any
    .replace(/^\/media\//, "") // remove /media/ prefix
    .split("/")
    .pop()!;                 // keep only filename
}

export function getOptimizedImage(filename: string, slot: ImageSlot = "card", dim?: "width"|"height") {
  const key = normalizeFilename(filename);
  const entry = manifest[key];
  const dimension = dim ?? "width";

  if (!entry) return null;

  const formats = IMAGE_CONFIG.formats;
  const sizes = IMAGE_CONFIG.sizes[dimension];

  const basename = stripExt(key);

  const sources = formats.map((format) => {
    const srcSet = sizes
      .map((size) => {
        const url = `/generated/${format}/${dimension}/${size}/${basename}.${entry.hash}.${size}.${format}`;
        return `${url} ${size}w`;
      })
      .join(", ");

    const largest = sizes[sizes.length - 1];

    const src = `/generated/${format}/${dimension}/${largest}/${basename}.${entry.hash}.${largest}.${format}`;

    return {
      type: format,
      src,
      srcSet,
      sizes: IMAGE_SLOTS[slot],
    };
  });

  return {
    sources,
    fallback: sources[sources.length - 1],
  };
}