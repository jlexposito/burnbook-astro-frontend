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

const CDN_DOMAIN = "burnbookcdn.fauno.nl";

export function getOptimizedImage(filename: string, slot: ImageSlot = "card", dim?: "width"|"height") {
  const key = normalizeFilename(filename);
  const dimension = dim ?? "width";
  const formats = IMAGE_CONFIG.formats;
  const sizes = IMAGE_CONFIG.sizes[dimension];

  const basename = stripExt(key);

  const sources = formats.map((format) => {
    const srcSet = sizes
      .map((size) => {
        const url = `https://${CDN_DOMAIN}/${format}/${dimension}/${size}/${basename}.${size}.${format}`;
        return `${url} ${size}w`;
      })
      .join(", ");

    const largest = sizes[sizes.length - 1];
    const smallest = sizes[0];

    const src = `https://${CDN_DOMAIN}/${format}/${dimension}/${largest}/${basename}.${largest}.${format}`;
    const srcSmall = `https://${CDN_DOMAIN}/${format}/${dimension}/${smallest}/${basename}.${smallest}.${format}`;

    return {
      type: format,
      src,
      srcSmall,
      srcSet,
      sizes: IMAGE_SLOTS[slot],
    };
  });

  return {
    sources,
    fallback: sources[sources.length - 1],
  };
}