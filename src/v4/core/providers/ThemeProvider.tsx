import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { lighten, parseToHsl, darken, hslToColorString } from 'polished';
import { defaultConfig, GetConfigReturnValue } from './CustomizationProvider';

const SHADE_PERCENTAGES = [0.25, 0.4, 0.5, 0.75];

const generateShades = (hexColor?: string, isDarkMode = false): string[] => {
  if (!hexColor) return Array(SHADE_PERCENTAGES.length).fill('');

  if (isDarkMode === true && hexColor === defaultConfig.theme.dark.primary_color) {
    return ['#4a82f2', '#a0bdf8', '#d9e5fc', '#ffffff'];
  }

  if (isDarkMode === false && hexColor === defaultConfig.theme.light.primary_color) {
    return ['#4a82f2', '#a0bdf8', '#d9e5fc', '#ffffff'];
  }

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

export function useGenerateStylesShadeColors(config: GetConfigReturnValue) {
  const currentTheme = useTheme();

  const preferredTheme = useMemo(() => {
    if (config?.preferred_theme && config?.preferred_theme !== 'default') {
      return config.preferred_theme;
    }

    return 'default';
  }, [config?.preferred_theme, currentTheme]);

  const computedTheme = preferredTheme === 'default' ? currentTheme : preferredTheme;

  const generatedColors = useMemo(() => {
    const themeConfig = config?.theme?.[computedTheme] || {};

    const primary = generateShades(themeConfig.primary_color);

    return {
      '--asc-color-primary-default': themeConfig.primary_color,
      '--asc-color-primary-shade1': primary[0],
      '--asc-color-primary-shade2': primary[1],
      '--asc-color-primary-shade3': primary[2],
      '--asc-color-primary-shade4': primary[3],

      '--asc-color-secondary-default': themeConfig.secondary_color,
      '--asc-color-secondary-shade1': themeConfig.secondary_shade1_color,
      '--asc-color-secondary-shade2': themeConfig.secondary_shade2_color,
      '--asc-color-secondary-shade3': themeConfig.secondary_shade3_color,
      '--asc-color-secondary-shade4': themeConfig.secondary_shade4_color,

      '--asc-color-alert-default': themeConfig.alert_color,

      '--asc-color-base-inverse': themeConfig.base_inverse_color,

      '--asc-color-base-default': themeConfig.base_color,
      '--asc-color-base-shade1': themeConfig.base_shade1_color,
      '--asc-color-base-shade2': themeConfig.base_shade2_color,
      '--asc-color-base-shade3': themeConfig.base_shade3_color,
      '--asc-color-base-shade4': themeConfig.base_shade4_color,
      '--asc-color-base-shade5': themeConfig.base_shade5_color,

      '--asc-color-background-default': themeConfig.background_color,
    };
  }, [config, computedTheme]);

  return generatedColors as React.CSSProperties;
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
