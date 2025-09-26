import { parseToHsl } from 'polished';
import { HslColor, HslaColor } from 'polished/lib/types/color';
import defaultTheme from './default-theme';
import { isNonNullable } from '~/helpers/utils';

const toFixed = (value: number) => value.toFixed(1);
const toFixedPercentage = (value: number) => {
  const asPercentage = Math.min(value * 100, 100);
  return toFixed(asPercentage);
};

function isHslaColor(color: HslColor | HslaColor): color is HslaColor {
  return (color as HslaColor).alpha !== undefined;
}

export const hslObjectToString = (hslObject: HslColor | HslaColor) => {
  const { hue, saturation, lightness } = hslObject;

  const hsl = [
    `${toFixed(hue)}`,
    `${toFixedPercentage(saturation)}%`,
    `${toFixedPercentage(lightness)}%`,
  ];

  return isHslaColor(hslObject)
    ? `hsla(${[...hsl, hslObject.alpha].filter(isNonNullable).join(',')})`
    : `hsl(${hsl.filter(isNonNullable).join(',')})`;
};

export const hexToHslString = (hexColor: string) => {
  const hslObject = parseToHsl(hexColor);
  return hslObjectToString(hslObject);
};

export const lightenHex = (lightenAmount: number, hexColorString: string) => {
  const currentHsl = parseToHsl(hexColorString);
  const { lightness } = currentHsl;
  const lightenedHsl = {
    ...currentHsl,
    lightness: Math.min(1, lightness + lightenAmount),
  };
  return hslObjectToString(lightenedHsl);
};

// Lightness values for color variations.
export const COLOR_SHADES = [0.25, 0.4, 0.5, 0.75];

type PaletteTheme = (typeof defaultTheme)['palette'];

/**
 * Converts all colors from hex format to hsl/hsla format.
 * Adds color variations based on the COLOR_SHADES constant.
 * @param {Object} mergedPaletteTheme
 */
export const buildPaletteTheme = (mergedPaletteTheme: PaletteTheme) => {
  const { system, ...otherColors } = mergedPaletteTheme;

  // Create a color theme object that uses hsl string values.
  const hslColorTheme = Object.keys(otherColors).reduce(
    (acc, colorKey) => {
      acc[colorKey] = {
        main: hexToHslString(otherColors[colorKey]),
      };
      return acc;
    },
    { ...otherColors } as Record<string, string | { [k: string]: string }>,
  );

  // Add color shade variations to each color type.
  const colorThemeExtended = (Object.keys(hslColorTheme) as string[]).reduce(
    (acc, colorKey) => {
      const currentHexColor = otherColors[colorKey as keyof typeof otherColors];
      const shades = COLOR_SHADES.reduce(
        (shadeAcc, shade, index) => {
          const shadeKey = `shade${index + 1}`;
          shadeAcc[shadeKey] = lightenHex(shade, currentHexColor);
          return shadeAcc;
        },
        {} as Record<string, string>,
      );
      const main = hslColorTheme[colorKey];
      if (main && typeof main === 'object') {
        acc[colorKey] = { ...shades, ...main };
      } else {
        acc[colorKey] = { ...shades, main };
      }
      return acc;
    },
    { ...hslColorTheme } as Record<string, string | { [k: string]: string }>,
  );

  return { ...colorThemeExtended, system };
};
