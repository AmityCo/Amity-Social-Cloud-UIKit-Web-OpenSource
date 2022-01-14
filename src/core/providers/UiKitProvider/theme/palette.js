import { parseToHsl } from 'polished';

const toFixed = (value) => value.toFixed(1);
const toFixedPercentage = (value) => {
  const asPercentage = Math.min(value * 100, 100);
  return toFixed(asPercentage);
};

export const hslObjectToString = (hslObject) => {
  const { hue, saturation, lightness, alpha } = hslObject;

  const hsl = [
    `${toFixed(hue)}`,
    `${toFixedPercentage(saturation)}%`,
    `${toFixedPercentage(lightness)}%`,
  ];

  return alpha ? `hsla(${[...hsl, alpha].join(',')})` : `hsl(${hsl.join(',')})`;
};

export const hexToHslString = (hexColor) => {
  const hslObject = parseToHsl(hexColor);
  return hslObjectToString(hslObject);
};

export const lightenHex = (lightenAmount, hexColorString) => {
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

/**
 * Converts all colors from hex format to hsl/hsla format.
 * Adds color variations based on the COLOR_SHADES constant.
 * @param {Object} mergedPaletteTheme
 */
export const buildPaletteTheme = (mergedPaletteTheme) => {
  const { system, ...otherColors } = mergedPaletteTheme;

  // Create a color theme object that uses hsl string values.
  const hslColorTheme = Object.keys(otherColors).reduce(
    (acc, colorKey) => {
      acc[colorKey] = {
        main: hexToHslString(otherColors[colorKey]),
      };
      return acc;
    },
    { ...otherColors },
  );

  // Add color shade variations to each color type.
  const colorThemeExtended = Object.keys(hslColorTheme).reduce(
    (acc, colorKey) => {
      const currentHexColor = otherColors[colorKey];
      COLOR_SHADES.forEach((shade, index) => {
        acc[colorKey][`shade${index + 1}`] = lightenHex(shade, currentHexColor);
      });
      return acc;
    },
    { ...hslColorTheme },
  );

  return { ...colorThemeExtended, system };
};
