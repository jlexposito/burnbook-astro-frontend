export const IMAGE_SLOTS = {
  thumbnail: "(max-width: 720px) 180px, 220px",
  // For card slot, we want to serve 220px images for small screens with low resolution, and 110px for small screens with high resolution. For larger screens, we can serve 180 (90 x 2) px images since they will be displayed smaller.
  card: "(max-width: 440px) and (max-resolution: 1dppx) 220px, (max-width: 440px) 110px, 90px",
  full: "100vw",
} as const;

export type ImageSlot = keyof typeof IMAGE_SLOTS;
