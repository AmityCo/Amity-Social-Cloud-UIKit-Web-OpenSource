import { parseToHsl } from 'polished';

const toFixed = value => value.toFixed(1);
const toFixedPercentage = value => {
  const asPercentage = Math.min(value * 100, 100);
  return toFixed(asPercentage);
};

export const hslObjectToString = hslObject => {
  const { hue, saturation, lightness, alpha } = hslObject;
  let hslString = `hsl(${toFixed(hue)}, ${toFixedPercentage(saturation)}%, ${toFixedPercentage(
    lightness,
  )}%`;

  if (alpha) {
    hslString += `, ${alpha}`;
  }
  return `${hslString})`;
};

export const hexToHslString = hexColor => {
  const hslObject = parseToHsl(hexColor);
  return hslObjectToString(hslObject);
};

const lightenHex = (percentageLighten, hexColorString) => {
  const currentHsl = parseToHsl(hexColorString);
  const { lightness } = currentHsl;
  const lightenedHsl = {
    ...currentHsl,
    // lightness: lightness * (1 + percentageLighten / 100),
    lightness: lightness + percentageLighten / 100,
  };
  return hslObjectToString(lightenedHsl);
};

// Percentage lightness values for color variations.
export const COLOR_SHADES = [25, 40, 50, 75];

/**
 * Converts all colors from hex format to hsl/hsla format.
 * Adds color variations based on the COLOR_SHADES constant.
 * @param {Object} mergedPaletteTheme
 */
export const buildPaletteTheme = mergedPaletteTheme => {
  // Create a color theme object that uses hsl string values.
  const hslColorTheme = Object.keys(mergedPaletteTheme).reduce(
    (acc, colorKey) => {
      acc[colorKey] = {
        main: hexToHslString(mergedPaletteTheme[colorKey]),
      };
      return acc;
    },
    { ...mergedPaletteTheme },
  );

  // Add color shade variations to each color type.
  const colorThemeExtended = Object.keys(hslColorTheme).reduce(
    (acc, colorKey) => {
      const currentHexColor = mergedPaletteTheme[colorKey];
      COLOR_SHADES.forEach((shade, index) => {
        acc[colorKey][`shade${index + 1}`] = lightenHex(shade, currentHexColor);
      });
      return acc;
    },
    { ...hslColorTheme },
  );

  return colorThemeExtended;
};
