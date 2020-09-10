import merge from 'lodash/merge';
import { parseToHsl } from 'polished';
import defaultTheme from './default-theme';

const hslObjectToString = hslObject => {
  const { hue, saturation, lightness, alpha } = hslObject;
  const toFixed = value => value.toFixed(1);

  let hslString = `hsl(${toFixed(hue)}, ${toFixed(saturation * 100)}%, ${toFixed(
    lightness * 100,
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
    lightness: lightness * (1 + percentageLighten / 100),
  };
  return hslObjectToString(lightenedHsl);
};

// Percentage lightness values for color variations.
export const COLOR_SHADES = [25, 40, 50, 75];

/**
 * Builds a global theme object combining default theme and an option override theme.
 * Converts all colors from hex format to hsl/hsla format.
 * Adds color variations based on the COLOR_SHADES constant.
 * @param {Object} overrideTheme
 */
const buildGlobalTheme = (overrideTheme = {}) => {
  const mergedTheme = merge(defaultTheme, overrideTheme);

  const mergedPaletteTheme = mergedTheme.palette;

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

  return {
    ...mergedTheme,
    palette: colorThemeExtended,
  };
};

export default buildGlobalTheme;
