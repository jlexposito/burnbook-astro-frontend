import type { ImageFileFormat } from "@utils/interfaces";
import manifest from "@src/image-manifest.json";

export type OptimizedImageInput = {
  filename: string;
  altTitle?: string;
  class?: string;
  loading?: "lazy" | "eager";
  highPriority?: boolean;
};

/**
 * Build srcset directly from manifest
 */
const buildSource = (filename: string, format: ImageFileFormat) => {
  const entry = manifest[filename];

  if (!entry) {
    throw new Error(`Missing image in manifest: ${filename}`);
  }

  const basename = filename.replace(/\.[^/.]+$/, "");

  const sizes = entry.sizes;

  const srcSet = sizes
    .map((size) => {
      const url = `/generated/${format}/${size}/${basename}.${entry.hash}.${size}.${format}`;
      return `${url} ${size}w`;
    })
    .join(", ");

  const largest = sizes[sizes.length - 1];

  const src = `/generated/${format}/${largest}/${basename}.${entry.hash}.${largest}.${format}`;

  return { src, srcSet, sizes };
};

/**
 * FINAL API: filename-only
 */
export const getOptimizedImage = (filename: string) => {
  const entry = manifest[filename];
  console.log(entry);

  if (!entry) {
    return null;
  }

  const formats = entry.formats;

  const sources = formats.map((format) => {
    const built = buildSource(filename, format);

    return {
      type: format,
      src: built.src,
      srcSet: built.srcSet,
      sizes: built.sizes,
    };
  });

  return {
    sources,
    fallback: sources[sources.length - 1],
  };
};