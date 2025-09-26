import defaultTheme from '../default-theme';
import buildGlobalTheme from '..';
import { hexToHslString } from '../palette';

const overrideTheme = {
  palette: {
    primary: '#006400',
    neutral: '#006400',
  },
  typography: {
    global: {
      fontFamily: 'NewFontFamily',
    },
    heading: {
      fontSize: '100px',
    },
  },
};

describe('the buildGlobalTheme function', () => {
  const globalTheme = buildGlobalTheme(overrideTheme);

  test('uses values from the override theme when provided', () => {
    expect(globalTheme.palette.primary.main).toEqual(hexToHslString('#006400'));
    expect(globalTheme.typography.heading.fontSize).toEqual('100px');
    expect(globalTheme.typography.heading.fontFamily).toEqual('NewFontFamily');
  });

  test('retains the default values when override values are not provided', () => {
    expect(globalTheme.palette.base.main).toEqual(hexToHslString(defaultTheme.palette.base));
    expect(globalTheme.typography.title.fontWeight).toEqual(
      defaultTheme.typography.title.fontWeight,
    );
  });
});
