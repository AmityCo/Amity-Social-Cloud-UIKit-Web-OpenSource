import merge from 'lodash/merge';
import defaultTheme from './default-theme';
import { buildPaletteTheme } from './palette';
import { buildTypographyTheme } from './typography';
import { defaultThemeV4 } from '~/v4/social/constants/default-theme-v4';

/**
 * Builds a global theme object combining default theme and an optional override theme.
 * @param {Object} overrideTheme
 */
const buildGlobalTheme = (overrideTheme = {}) => {
  const mergedTheme = merge(defaultTheme, overrideTheme);

  const paletteExtended = buildPaletteTheme(mergedTheme.palette);
  const typographyExtended = buildTypographyTheme(mergedTheme.typography);

  return {
    ...mergedTheme,
    palette: paletteExtended,
    typography: typographyExtended,
    v4: defaultThemeV4,
  };
};

export default buildGlobalTheme;
