// CSS properties that cannot be overridden via theme.
const ALLOWED_PROPERTIES = ['fontFamily', 'fontStyle', 'fontWeight', 'fontSize'];

/**
 * Removes properties from filter object that cannot be customised.
 * Only allow certain CSS properties to be overridden - those in ALLOWED_PROPERTIES
 * @param {Object} styleObject
 */
export const filterStyleKeys = (styleObject: {
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: string | number;
  fontSize?: string;
}) => {
  const filteredStyleObject = Object.keys(styleObject).reduce(
    (acc, styleKey) => {
      const styleObjectForKey = styleObject[styleKey];
      if (styleKey && styleObjectForKey && ALLOWED_PROPERTIES.includes(styleKey)) {
        acc[styleKey] = styleObjectForKey;
      }
      return acc;
    },
    {} as Record<string, string | number>,
  );
  return filteredStyleObject;
};

/**
 * Merges the global theme properties with other typography properties.
 * Remove style propertie that are not allow to be customised via theme.
 * @param {Object} mergedTypographyTheme
 */
export const buildTypographyTheme = (mergedTypographyTheme: {
  [key: string]: {
    fontFamily?: string;
    fontStyle?: string;
    fontWeight?: string | number;
    fontSize?: string;
  };
}) => {
  const filteredTheme = Object.keys(mergedTypographyTheme).reduce(
    (acc, curr) => {
      acc[curr] = filterStyleKeys({
        ...mergedTypographyTheme.global,
        ...mergedTypographyTheme[curr],
      });
      return acc;
    },
    {} as Record<string, Record<string, string | number>>,
  );

  return filteredTheme;
};
