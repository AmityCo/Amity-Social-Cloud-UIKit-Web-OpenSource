import React, { createContext, useEffect, useState } from 'react';
import { lighten, parseToHsl, darken, hslToColorString } from 'polished';
import { defaultConfig, useCustomization } from './CustomizationProvider';

const SHADE_PERCENTAGES = [0.25, 0.4, 0.5, 0.75];

const setCSSVariable = (variable: string, value?: string) => {
  if (!value) return;
  document.documentElement.style.setProperty(variable, value);
};

const generateShades = (hexColor: string, isDarkMode = false): string[] => {
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

export const ThemeContext = createContext<{
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  currentTheme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
  const config = useCustomization().config || defaultConfig;

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (config.theme?.light) {
      const primaryColorShades = generateShades(config.theme.light.primary_color);
      const secondaryColorShades = generateShades(config.theme.light.secondary_color);

      setCSSVariable('--asc-color-primary-default', config.theme.light.primary_color);
      setCSSVariable('--asc-color-primary-shade1', primaryColorShades[0]);
      setCSSVariable('--asc-color-primary-shade2', primaryColorShades[1]);
      setCSSVariable('--asc-color-primary-shade3', primaryColorShades[2]);
      setCSSVariable('--asc-color-primary-shade4', primaryColorShades[3]);

      setCSSVariable('--asc-color-secondary-default', config.theme.light.secondary_color);
      setCSSVariable('--asc-color-secondary-shade1', secondaryColorShades[0]);
      setCSSVariable('--asc-color-secondary-shade2', secondaryColorShades[1]);
      setCSSVariable('--asc-color-secondary-shade3', secondaryColorShades[2]);
      setCSSVariable('--asc-color-secondary-shade4', secondaryColorShades[3]);

      setCSSVariable('--asc-color-base-default', config.theme.light.base_color);
      setCSSVariable('--asc-color-base-shade1', config.theme.light.base_shade1_color);
      setCSSVariable('--asc-color-base-shade2', config.theme.light.base_shade2_color);
      setCSSVariable('--asc-color-base-shade3', config.theme.light.base_shade3_color);
      setCSSVariable('--asc-color-base-shade4', config.theme.light.base_shade4_color);

      setCSSVariable('--asc-color-alert', config.theme.light.alert_color);
      setCSSVariable('--asc-color-background', config.theme.light.background_color);
    }

    if (config.theme?.dark) {
      setCSSVariable('--asc-color-primary-dark', config.theme.dark.primary_color);
    }
  }, [currentTheme, config]);

  useEffect(() => {
    if (config.preferred_theme === 'default') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [config.preferred_theme]);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};
