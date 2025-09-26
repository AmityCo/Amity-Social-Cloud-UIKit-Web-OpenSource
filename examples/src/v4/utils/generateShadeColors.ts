import { darken, lighten } from 'polished';

/**
 * Enum representing different shade factors.
 */
export enum ShadeFactor {
  DEFAULT = 0.0,
  SHADE1 = 0.25,
  SHADE2 = 0.4,
  SHADE3 = 0.5,
  SHADE4 = 0.75,
}

/**
 * Interface representing the shaded colors for primary and secondary colors.
 */
interface ShadeColors {
  primaryShades: string[];
  secondaryShades: string[];
}

/**
 * Generates shaded colors for the provided primary and secondary colors based on the given shade factor.
 *
 * @param primaryColor - The primary color in CSS color string format.
 * @param secondaryColor - The secondary color in CSS color string format.
 * @param shadeFactor - The shade factor to use for generating shaded colors.
 * @returns An object containing arrays of shaded colors for the primary and secondary colors.
 */
export function generateShadeColors(
  primaryColor: string,
  secondaryColor: string,
  shadeFactor: ShadeFactor,
): ShadeColors {
  const darkenAmount = shadeFactor / (1 - ShadeFactor.DEFAULT);
  const lightenAmount = 1 - darkenAmount;

  const primaryShades = [
    primaryColor,
    lighten(lightenAmount, primaryColor),
    lighten(lightenAmount * 2, primaryColor),
    lighten(lightenAmount * 3, primaryColor),
    lighten(lightenAmount * 4, primaryColor),
  ];

  const secondaryShades = [
    secondaryColor,
    darken(darkenAmount, secondaryColor),
    darken(darkenAmount * 2, secondaryColor),
    darken(darkenAmount * 3, secondaryColor),
    darken(darkenAmount * 4, secondaryColor),
  ];

  return { primaryShades, secondaryShades };
}
