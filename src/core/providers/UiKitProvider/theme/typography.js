// CSS properties that cannot be overridden via theme.
const ALLOWED_PROPERTIES = ['fontFamily', 'fontStyle', 'fontWeight', 'fontSize'];

/**
 * Removes properties from filter object that cannot be customised.
 * Only allow certain CSS properties to be overridden - those in ALLOWED_PROPERTIES
 * @param {Object} styleObject
 */
export const filterStyleKeys = (styleObject) => {
  const filteredStyleObject = Object.keys(styleObject).reduce((acc, styleKey) => {
    if (ALLOWED_PROPERTIES.includes(styleKey)) {
      acc[styleKey] = styleObject[styleKey];
    }
    return acc;
  }, {});
  return filteredStyleObject;
};

/**
 * Merges the global theme properties with other typography properties.
 * Remove style propertie that are not allow to be customised via theme.
 * @param {Object} mergedTypographyTheme
 */
export const buildTypographyTheme = (mergedTypographyTheme) => {
  const filteredTheme = Object.keys(mergedTypographyTheme).reduce((acc, curr) => {
    acc[curr] = filterStyleKeys({
      ...mergedTypographyTheme.global,
      ...mergedTypographyTheme[curr],
    });
    return acc;
  }, {});

  return filteredTheme;
};
