export const IMAGE_CONFIG = {
  formats: ["avif", "webp", "jpeg"],
  sizes: {
    height: [],
    width: [320, 640, 960, 1280, 1920]
  },
} as const;

export type ImageFormat = (typeof IMAGE_CONFIG.formats)[number];
export type ImageSize = (typeof IMAGE_CONFIG.sizes)[keyof typeof IMAGE_CONFIG.sizes][number];
