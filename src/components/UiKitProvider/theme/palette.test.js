import defaultTheme from './default-theme';
import buildGlobalTheme, { hexToHslString, COLOR_SHADES } from './palette';

const overrideTheme = {
  palette: {
    primary: '#006400',
    neutral: '#006400',
  },
  typography: {
    headline: `font-family: Arial;`,
  },
};

describe('the buildGlobalTheme function', () => {
  describe('merging the default theme with override theme', () => {
    test('uses values from the override theme', () => {
      const globalTheme = buildGlobalTheme(overrideTheme);
      expect(globalTheme.palette.primary.main).toEqual(
        hexToHslString(overrideTheme.palette.primary),
      );
      expect(globalTheme.typography.heading).toEqual(overrideTheme.typography.heading);
    });

    test('uses values from the default theme when override values are not provided', () => {
      const globalTheme = buildGlobalTheme(overrideTheme);
      expect(globalTheme.palette.base.main).toEqual(hexToHslString(defaultTheme.palette.base));
      expect(globalTheme.typography.title).toEqual(defaultTheme.typography.title);
    });
  });

  describe('extending the color theme to include shade variations', () => {
    const globalTheme = buildGlobalTheme(overrideTheme);

    test('adds the correct number of color shade variations', () => {
      const expectedColorsPerType = COLOR_SHADES.length + 1;
      expect(Object.keys(globalTheme.palette.base).length).toBe(expectedColorsPerType);
      expect(Object.keys(globalTheme.palette.primary).length).toBe(expectedColorsPerType);
    });

    test('adds named color shade variations', () => {
      const primaryColorVariations = Object.keys(globalTheme.palette.primary);
      expect(primaryColorVariations.includes('primary'));
      expect(primaryColorVariations.includes('shade1'));
      expect(primaryColorVariations.includes('shade2'));
    });
  });
});
