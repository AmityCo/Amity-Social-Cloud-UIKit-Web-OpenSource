import { filterStyleKeys, buildTypographyTheme } from './typography';

describe('the typography theme helper functions', () => {
  describe('the filterStyleKeys function', () => {
    test('removes properties that are not allowed', () => {
      const styleInput = {
        fontSize: '12px',
        fontWeight: 400,
        notAllowedProperty: 'example',
      };
      expect(filterStyleKeys(styleInput)).toEqual({
        fontSize: '12px',
        fontWeight: 400,
      });
    });
  });

  describe('the buildTypographyTheme function', () => {
    test('merges the global properties values into all other typography properties ', () => {
      const initialMergedTheme = {
        global: {
          fontFamily: 'Inter',
          fontStyle: 'normal',
        },
        heading: {
          fontWeight: 600,
          fontSize: '20px',
        },
      };

      expect(buildTypographyTheme(initialMergedTheme)).toEqual({
        global: {
          fontFamily: 'Inter',
          fontStyle: 'normal',
        },
        heading: {
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '20px',
        },
      });
    });

    test('removes properties that are not allowed', () => {
      const initialMergedTheme = {
        global: {
          fontFamily: 'Inter',
          fontStyle: 'normal',
          notAllowedProperty: 'example',
        },
        heading: {
          fontWeight: 600,
          fontSize: '20px',
          anotherNotAllowedProperty: 'example',
        },
      };

      const finalTypographyTheme = buildTypographyTheme(initialMergedTheme);
      expect(finalTypographyTheme.global).not.toHaveProperty('notAllowedProperty');
      expect(finalTypographyTheme.global).not.toHaveProperty('anotherNotAllowedProperty');
      expect(finalTypographyTheme.heading).not.toHaveProperty('notAllowedProperty');
      expect(finalTypographyTheme.heading).not.toHaveProperty('anotherNotAllowedProperty');
    });
  });
});
