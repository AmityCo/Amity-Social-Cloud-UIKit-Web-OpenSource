import { buildPaletteTheme, hslObjectToString, COLOR_SHADES } from '../palette';

const initialTheme = {
  primary: '#006400',
  neutral: '#006400',
};

describe('the buildPaletteTheme function', () => {
  const finalPaletteTheme = buildPaletteTheme(initialTheme);

  test('adds the correct number of shade variations for each color type', () => {
    const expectedColorsPerType = COLOR_SHADES.length + 1;
    expect(Object.keys(finalPaletteTheme.primary).length).toBe(expectedColorsPerType);
    expect(Object.keys(finalPaletteTheme.neutral).length).toBe(expectedColorsPerType);
  });

  test('adds correctly named shade variations for each color type', () => {
    const primaryColorVariations = Object.keys(finalPaletteTheme.primary);
    expect(primaryColorVariations.includes('main'));
    expect(primaryColorVariations.includes('shade1'));
    expect(primaryColorVariations.includes('shade2'));
  });
});

describe('the hslObjectToString function', () => {
  const hslObject = {
    hue: 8,
    saturation: 0.5,
    lightness: 0.8,
  };
  test('converts a hsl object to hsl string', () => {
    expect(hslObjectToString(hslObject)).toBe('hsl(8.0,50.0%,80.0%)');
  });

  test('converts a hsla object to hsla string', () => {
    const hslaObject = {
      ...hslObject,
      alpha: 0.3,
    };
    expect(hslObjectToString(hslaObject)).toBe('hsla(8.0,50.0%,80.0%,0.3)');
  });
});
