import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { lighten, parseToHsl, darken, hslToColorString } from 'polished';
import { defaultConfig, GetConfigReturnValue } from './CustomizationProvider';

const SHADE_PERCENTAGES = [0.25, 0.4, 0.5, 0.75];

const generateShades = (hexColor?: string, isDarkMode = false): string[] => {
  if (!hexColor) return Array(SHADE_PERCENTAGES.length).fill('');

  const hslColor = parseToHsl(hexColor);

  const shades = SHADE_PERCENTAGES.map((percentage) => {
    if (isDarkMode) {
      return darken(percentage, hslToColorString(hslColor));
    } else {
      return lighten(percentage, hslToColorString(hslColor));
    }
  });

  return shades;
};

export function useGenerateStylesShadeColors(inputConfig?: GetConfigReturnValue) {
  const currentTheme = useTheme();

  const inputThemeConfig = inputConfig?.theme;

  const preferredTheme = useMemo(() => {
    if (inputConfig?.preferred_theme && inputConfig?.preferred_theme !== 'default') {
      return inputConfig.preferred_theme;
    }

    return 'default';
  }, [inputConfig?.preferred_theme, currentTheme]);

  const generatedLightColors = (() => {
    if (inputThemeConfig?.light) {
      const lightThemeConfig = inputThemeConfig?.light || defaultConfig.theme.light;

      const lightPrimary = generateShades(lightThemeConfig.primary_color);
      const lightSecondary = generateShades(lightThemeConfig.secondary_color);
      return {
        '--asc-color-primary-default': lightThemeConfig.primary_color,
        '--asc-color-primary-shade1': lightPrimary[0],
        '--asc-color-primary-shade2': lightPrimary[1],
        '--asc-color-primary-shade3': lightPrimary[2],
        '--asc-color-primary-shade4': lightPrimary[3],

        '--asc-color-secondary-default': lightThemeConfig.secondary_color,
        '--asc-color-secondary-shade1': lightSecondary[0],
        '--asc-color-secondary-shade2': lightSecondary[1],
        '--asc-color-secondary-shade3': lightSecondary[2],
        '--asc-color-secondary-shade4': lightSecondary[3],
        '--asc-color-secondary-shade5': '#f9f9fa',

        '--asc-color-alert': '#fa4d30',
        '--asc-color-black': '#000000',
        '--asc-color-white': '#ffffff',

        '--asc-color-base-inverse': '#000000',

        '--asc-color-base-default': '#292b32',
        '--asc-color-base-shade1': '#636878',
        '--asc-color-base-shade2': '#898e9e',
        '--asc-color-base-shade3': '#a5a9b5',
        '--asc-color-base-shade4': '#ebecef',
        '--asc-color-base-shade5': '#f9f9fa',

        '--asc-color-base-background': defaultConfig.theme.light.background_color,
      };
    }

    return {};
  })();

  const generatedDarkColors = (() => {
    if (inputThemeConfig?.dark) {
      const darkThemeConfig = inputThemeConfig?.dark || defaultConfig.theme.dark;
      const darkPrimary = generateShades(darkThemeConfig.primary_color, true);
      const darkSecondary = generateShades(darkThemeConfig.secondary_color, true);

      return {
        '--asc-color-primary-default': darkThemeConfig.primary_color,
        '--asc-color-primary-shade1': darkPrimary[0],
        '--asc-color-primary-shade2': darkPrimary[1],
        '--asc-color-primary-shade3': darkPrimary[2],
        '--asc-color-primary-shade4': darkPrimary[3],

        '--asc-color-secondary-default': darkThemeConfig.secondary_color,
        '--asc-color-secondary-shade1': darkSecondary[0],
        '--asc-color-secondary-shade2': darkSecondary[1],
        '--asc-color-secondary-shade3': darkSecondary[2],
        '--asc-color-secondary-shade4': darkSecondary[3],
        '--asc-color-secondary-shade5': '#f9f9fa',

        '--asc-color-alert': '#fa4d30',
        '--asc-color-black': '#000000',
        '--asc-color-white': '#ffffff',

        '--asc-color-base-inverse': '#ffffff',

        '--asc-color-base-default': '#ebecef',
        '--asc-color-base-shade1': '#a5a9b5',
        '--asc-color-base-shade2': '#6e7487',
        '--asc-color-base-shade3': '#40434e',
        '--asc-color-base-shade4': '#292b32',
        '--asc-color-base-shade5': '#f9f9fa',

        '--asc-color-base-background': defaultConfig.theme.dark.background_color,
      };
    }
    return {};
  })();

  const computedTheme = preferredTheme === 'default' ? currentTheme : preferredTheme;

  return {
    ...(computedTheme === 'light' ? generatedLightColors : generatedDarkColors),
  } as React.CSSProperties;
}

export const ThemeContext = createContext<{
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  currentTheme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    mediaQuery.matches ? 'dark' : 'light',
  );

  useEffect(() => {
    const handleChange = (e: MediaQueryListEvent) => {
      setCurrentTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const { currentTheme } = useContext(ThemeContext);

  return currentTheme;
};
