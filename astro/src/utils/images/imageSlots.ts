export const IMAGE_SLOTS = {
  thumbnail: "(max-width: 720px) 180px, 220px",
  /**
 * GRID CARD SLOT (1/3rd of Card Width)
 * * WHY THIS MATH?
 * * - Mobile (1 col): Image takes up 1/3rd of full screen (33vw)
 * - Tablet (2 col): Image takes up 1/3rd of half screen (16.5vw)
 * - Laptop (3 col): Image takes up 1/3rd of a third of the screen (11vw)
 * - Desktop (4 col): Image takes up 1/3rd of a fourth of the screen (8.3vw)
 * * This math forces high-DPI (2x/3x) devices to always request our light 320w asset.
 */
  card: "(min-width: 1536px) 8.3vw, (min-width: 1024px) 11vw, (min-width: 768px) 16.5vw, 33vw",
  full: "(min-width: 1200px) 1200px, 100vw",
} as const;

export type ImageSlot = keyof typeof IMAGE_SLOTS;