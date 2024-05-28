import React, { createContext, useEffect, useState } from 'react';
import { lighten, parseToHsl, darken, hslToColorString } from 'polished';
import { useCustomization, Config, Theme } from './CustomizationProvider';

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

const generatePaletteByConfig = ({
  themeConfig,
  configId,
  isDarkMode,
}: {
  themeConfig: Theme['light'] | Theme['dark'];
  configId?: string;
  isDarkMode?: boolean;
}) => {
  const primaryColorShades = generateShades(themeConfig.primary_color, isDarkMode);
  const secondaryColorShades = generateShades(themeConfig.secondary_color, isDarkMode);

  const prefix = configId ? configId + '-' : '';

  setCSSVariable(`--${prefix}asc-color-primary-default`, themeConfig.primary_color);
  setCSSVariable(`--${prefix}asc-color-primary-shade1`, primaryColorShades[0]);
  setCSSVariable(`--${prefix}asc-color-primary-shade2`, primaryColorShades[1]);
  setCSSVariable(`--${prefix}asc-color-primary-shade3`, primaryColorShades[2]);
  setCSSVariable(`--${prefix}asc-color-primary-shade4`, primaryColorShades[3]);

  setCSSVariable(`--${prefix}asc-color-secondary-default`, themeConfig.secondary_color);
  setCSSVariable(`--${prefix}asc-color-secondary-shade1`, secondaryColorShades[0]);
  setCSSVariable(`--${prefix}asc-color-secondary-shade2`, secondaryColorShades[1]);
  setCSSVariable(`--${prefix}asc-color-secondary-shade3`, secondaryColorShades[2]);
  setCSSVariable(`--${prefix}asc-color-secondary-shade4`, secondaryColorShades[3]);

  setCSSVariable(`--${prefix}asc-color-base-default`, themeConfig.base_color);
  setCSSVariable(`--${prefix}asc-color-base-shade1`, themeConfig.base_shade1_color);
  setCSSVariable(`--${prefix}asc-color-base-shade2`, themeConfig.base_shade2_color);
  setCSSVariable(`--${prefix}asc-color-base-shade3`, themeConfig.base_shade3_color);
  setCSSVariable(`--${prefix}asc-color-base-shade4`, themeConfig.base_shade4_color);

  setCSSVariable(`--${prefix}asc-color-alert`, themeConfig.alert_color);
  setCSSVariable(`--${prefix}asc-color-base-background`, themeConfig.background_color);
  setCSSVariable(`--${prefix}asc-color-base-inverse`, themeConfig.base_inverse_color);
};

const generateComponentPalette = (config: Config, currentTheme: 'light' | 'dark') => {
  const configurables = [
    {
      pageId: 'live_chat',
      componentIds: ['chat_header', 'message_list', 'message_composer'],
    },
  ];

  configurables.forEach((configurable) => {
    const pageConfig = (config.customizations as { [key: string]: { theme: Theme } })?.[
      `${configurable.pageId}/*/*`
    ]?.theme;

    if (pageConfig) {
      const themeToGenerate = currentTheme === 'light' ? pageConfig.light : pageConfig.dark;
      const configId = configurable.pageId.replace('_', '-');

      if (themeToGenerate) {
        generatePaletteByConfig({
          themeConfig: themeToGenerate,
          configId,
          isDarkMode: currentTheme === 'dark',
        });
      }
    }

    if (configurable.componentIds.length === 0) return;

    configurable.componentIds.forEach((componentId) => {
      const componentConfig = (config.customizations as { [key: string]: { theme: Theme } })?.[
        `${configurable.pageId}/${componentId}/*`
      ].theme;
      if (componentConfig) {
        const themeToGenerate =
          currentTheme === 'light' ? componentConfig.light : componentConfig.dark;

        const configId =
          configurable.pageId.replace('_', '-') + '-' + componentId.replace('_', '-');

        if (themeToGenerate) {
          generatePaletteByConfig({
            themeConfig: themeToGenerate,
            configId,
            isDarkMode: currentTheme === 'dark',
          });
        }
      }
    });
  });
};

export const ThemeContext = createContext<{
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  currentTheme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
  const { config } = useCustomization();
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    config?.preferred_theme && config?.preferred_theme !== 'default'
      ? config.preferred_theme
      : mediaQuery.matches
      ? 'dark'
      : 'light',
  );

  useEffect(() => {
    if (!config) return;
    const themeToGenerate = currentTheme === 'light' ? config.theme?.light : config.theme?.dark;

    if (themeToGenerate) {
      generatePaletteByConfig({
        themeConfig: themeToGenerate,
        isDarkMode: currentTheme === 'dark',
      });
    }

    generateComponentPalette(config, currentTheme);
  }, [currentTheme, config]);

  useEffect(() => {
    if (!config) return;

    if (config.preferred_theme === 'default') {
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [config?.preferred_theme]);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};
