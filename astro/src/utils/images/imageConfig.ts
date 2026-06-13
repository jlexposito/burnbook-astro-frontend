export const IMAGE_CONFIG = {
  formats: ["avif", "webp", "jpeg"],
  sizes: [180, 220, 320],
} as const;

export type ImageFormat = (typeof IMAGE_CONFIG.formats)[number];
export type ImageSize = (typeof IMAGE_CONFIG.sizes)[number];
