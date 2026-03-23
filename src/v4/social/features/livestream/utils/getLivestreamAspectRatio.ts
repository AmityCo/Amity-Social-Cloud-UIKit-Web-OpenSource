export type LivestreamResolution = {
  width?: number;
  height?: number;
};

/**
 * Determines the aspect ratio string for livestream thumbnails based on resolution data.
 *
 * Aspect ratio mapping (per v4 spec):
 * - Portrait/square (height >= width) → 4:5
 * - Landscape (width > height) → 16:9
 * - No resolution data → 16:9 (Web default)
 *
 * @param resolution - Optional resolution data with width and height
 * @returns Aspect ratio as a CSS-compatible string (e.g., "16 / 9" or "4 / 5")
 */
export function getLivestreamAspectRatioString(resolution?: LivestreamResolution): string {
  const PORTRAIT_RATIO_STR = '4 / 5';
  const LANDSCAPE_RATIO_STR = '16 / 9';

  if (resolution?.width && resolution?.height) {
    // Portrait or square: height >= width → 4:5
    if (resolution.height >= resolution.width) {
      return PORTRAIT_RATIO_STR;
    }
    // Landscape: width > height → 16:9
    return LANDSCAPE_RATIO_STR;
  }

  // No resolution data: use Web default (16:9)
  return LANDSCAPE_RATIO_STR;
}
