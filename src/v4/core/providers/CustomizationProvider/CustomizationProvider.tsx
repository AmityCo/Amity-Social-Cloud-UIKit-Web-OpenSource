import React, { createContext, useContext, useState, useEffect } from 'react';
import { AmityReactionType } from '~/v4/core/providers/CustomReactionProvider';
import { useTheme } from '~/v4/core/providers/ThemeProvider';
import {
  getCustomizationKeys,
  IconConfiguration,
  TextConfiguration,
  CustomConfiguration,
  defaultBaseThemeValue,
  defaultConfig,
  ConfigurableThemeValue,
  Theme,
  DefaultConfig,
  themePropertiesToCSSVar,
  GetConfigReturnValue,
} from './utils';

interface CustomizationContextValue {
  config: Config | null;
  parseConfig: (config: Config) => void;
  isExcluded: (path: string) => boolean;
  getConfig: (path: string) => GetConfigReturnValue;
}

export type NetworkConfig = {
  config: DefaultConfig;
};

export const enum UserAccessTypes {
  ALL = 'all',
  SIGNED_IN_USER_ONLY = 'singed_in_user_only',
  NONE = 'none',
}

export type UserAccess = `${UserAccessTypes}`;

export interface Config {
  preferred_theme?: 'light' | 'dark' | 'default';
  theme?: {
    light?: Theme['light'];
    dark?: Theme['dark'];
  };
  excludes?: string[];
  message_reactions?: AmityReactionType[];
  social_reactions?: AmityReactionType[];
  customizations?: {
    [key: string]: GetConfigReturnValue;
  };
  feature_flags?: {
    post?: {
      clip?: {
        can_create: UserAccess;
        can_view_tab: UserAccess;
      };
    };
  };
}

const CustomizationContext = createContext<CustomizationContextValue>({
  config: null,
  parseConfig: () => {},
  isExcluded: () => false,
  getConfig: () => ({}),
});

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};

interface CustomizationProviderProps {
  children: React.ReactNode;
  initialConfig: Config | undefined;
}

export const getDefaultConfig: CustomizationContextValue['getConfig'] = (path: string) => {
  const [page, component, element] = path.split('/');

  const customizationKeys = getCustomizationKeys({ page, component, element });

  return new Proxy<
    IconConfiguration & TextConfiguration & { theme?: Partial<Theme> } & CustomConfiguration
  >(
    {},
    {
      get(target, prop: string) {
        for (const key of customizationKeys) {
          if (defaultConfig?.customizations?.[key]?.[prop]) {
            return defaultConfig.customizations[key][prop];
          }
        }
      },
    },
  );
};

export const CustomizationProvider: React.FC<CustomizationProviderProps> = ({
  children,
  initialConfig = {},
}) => {
  const [config, setConfig] = useState<Config | null>(null);

  const { currentTheme } = useTheme();

  useEffect(() => {
    if (validateConfig(initialConfig)) {
      themePropertiesToCSSVar({
        theme: { ...initialConfig?.theme?.[currentTheme], ...defaultBaseThemeValue[currentTheme] },
      });

      parseConfig(initialConfig);
    } else {
      console.error('Invalid configuration provided to CustomizationProvider');
    }
  }, [initialConfig, currentTheme]);

  const validateConfig = (config: Config): boolean => {
    return true;
  };

  const parseConfig = (newConfig: Config) => {
    setConfig(newConfig);
  };

  const isExcluded = (path: string) => {
    const [page, component, element] = path.split('/');

    const customizationKeys = getCustomizationKeys({ page, component, element });

    return (
      config?.excludes?.some((excludedPath) => {
        return customizationKeys.some((key) => key === excludedPath);
      }) || false
    );
  };

  const getConfig: CustomizationContextValue['getConfig'] = (path: string) => {
    const [page, component, element] = path.split('/');

    const customizationKeys = getCustomizationKeys({ page, component, element });

    const buildThemeProxyHandler = (
      themeName: 'light' | 'dark',
    ): ProxyHandler<
      IconConfiguration & TextConfiguration & { theme?: Partial<Theme> } & CustomConfiguration
    > => ({
      get(_, prop: keyof ConfigurableThemeValue) {
        for (const key of customizationKeys) {
          if (config?.customizations?.[key]?.theme?.[themeName]?.[prop]) {
            return config.customizations[key].theme?.[themeName]?.[prop];
          }
        }

        if (config?.theme?.[themeName]?.[prop]) {
          return config.theme[themeName]?.[prop];
        }

        for (const key of customizationKeys) {
          if (defaultConfig.customizations?.[key]?.theme?.[themeName]?.[prop]) {
            return defaultConfig.customizations[key].theme?.[themeName]?.[prop];
          }
        }

        return defaultConfig.theme[themeName][prop];
      },
    });

    return new Proxy<
      IconConfiguration & TextConfiguration & { theme?: Partial<Theme> } & CustomConfiguration
    >(
      {},
      {
        get(target, prop: string) {
          if (prop === 'theme') {
            return {
              light: new Proxy({}, buildThemeProxyHandler('light')),
              dark: new Proxy({}, buildThemeProxyHandler('dark')),
            };
          }

          if (prop === 'preferred_theme') {
            return config?.preferred_theme ?? defaultConfig.preferred_theme;
          }

          for (const key of customizationKeys) {
            if (config?.customizations?.[key]?.[prop]) {
              return config.customizations[key][prop];
            }
          }

          for (const key of customizationKeys) {
            if (defaultConfig?.customizations?.[key]?.[prop]) {
              return defaultConfig.customizations[key][prop];
            }
          }
        },
      },
    );
  };

  const contextValue: CustomizationContextValue = {
    config,
    parseConfig,
    isExcluded,
    getConfig,
  };

  return (
    <CustomizationContext.Provider value={contextValue}>{children}</CustomizationContext.Provider>
  );
};
