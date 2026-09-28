import React, { createContext, useContext, useState, useEffect } from 'react';
import { AMITY_PAGE_MODULE, AMITY_COMPONENT_MODULE, AMITY_ELEMENT_MODULE } from './moduleGraph';
import type { AmityUIKitFeature } from './features';
import { moduleOfSdkFn, setSdkFnGate } from './moduleApi';
import { entitlementKey, isModuleGranted, requirementOf } from './entitlement';
import { AmityReactionType } from '~/v4/core/providers/CustomReactionProvider';
import { useTheme } from '~/v4/core/providers/ThemeProvider';
import {
  getCustomizationKeys,
  IconConfiguration,
  TextConfiguration,
  CustomConfiguration,
  defaultBaseThemeValue,
  defaultConfig,
  Theme,
  DefaultConfig,
  DesignTokens,
  themePropertiesToCSSVar,
  injectColorTokenLayers,
  GetConfigReturnValue,
} from './utils';

interface CustomizationContextValue {
  config: Config | null;
  /**
   * What the network bought, as core reports it, or null before the read lands.
   *
   * Kept beside the config rather than merged into it: the config is the
   * customer's own file and they may edit it, the entitlement is core's answer
   * and they may not.
   */
  entitlement: Amity.ModuleSettings | null;
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
  // No `features` block. Whether a module exists is the network's plan to
  // answer and nobody else's — a customer who was sold Live and does not want
  // it is not a case this product supports, and a file that could withhold one
  // was a second source to reconcile against core for no gain. `feature_flags`
  // below is a different question and stays: it says who may do something
  // inside a feature that exists.
  design_tokens?: DesignTokens;
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
    chat?: {
      enabled_channel_types?: ('conversation' | 'community')[];
      conversation_chat_user_actions?: { name: 'mute' | 'report' | 'block'; enabled: boolean }[];
    };
  };
}

const CustomizationContext = createContext<CustomizationContextValue>({
  config: null,
  entitlement: null,
  parseConfig: () => {},
  isExcluded: () => false,
  getConfig: () => ({}),
});

/**
 * Whether a feature is switched on.
 *
 * Every call site reads through here rather than testing the config inline, so
 * a future feature that should default OFF is one change in this hook instead
 * of a sweep through the codebase.
 */
export type { AmityUIKitFeature };

export const useFeatureEnabled = (feature: AmityUIKitFeature): boolean => {
  const { config, entitlement } = useCustomization();

  return isFeatureEnabled(feature, entitlement);
};

/**
 * Whether the module behind an SDK function is switched on.
 *
 * The view layer already refuses to render a disabled module, but a React hook
 * cannot be called conditionally: every live hook sitting above an
 * `if (isExcluded) return null` still subscribes, so the request goes out for a
 * feature the customer never bought — and the backend now answers those with an
 * error rather than an empty result.
 *
 * Taking the SDK function itself, rather than a module name, is what keeps this
 * off the call sites: the five live hooks ask on every render and no caller can
 * forget to.
 */
export const useSdkFnEnabled = (fn: unknown): boolean => {
  const { entitlement } = useCustomization();
  const owner = moduleOfSdkFn(fn);

  return owner ? isFeatureEnabled(owner, entitlement) : true;
};

/**
 * Phase 1 sells modules in bundles, so a raw flag is not the answer: Post is
 * only sold with Community, Feed with Post, Comment with Post or Story. A
 * customer who switches Community off gets Post off too, whatever Post's own
 * flag says — otherwise the app offers a surface the customer cannot use.
 *
 * One source, not two: core's grant. There was a customer-side switch in
 * `config.json` beside it, and it is gone — whether a module exists is the
 * plan's answer, and a file that could withhold one was a second thing to
 * reconcile with no case behind it. The grants are taken as core reports them,
 * whatever the enforcement mode says. The bundle rules are core's
 * `catalog.requires`, which is OR: any one prerequisite satisfies it, so
 * Comment survives on a story-only network.
 *
 * `visiting` breaks a cycle: an unresolvable graph reads as disabled rather than
 * recursing forever, because a feature nobody can reason about must not ship
 * switched on.
 */
export const isFeatureEnabled = (
  key: string,
  entitlement?: Amity.ModuleSettings | null,
  visiting: ReadonlySet<string> = new Set(),
): boolean => {
  if (visiting.has(key)) return false;
  if (!isModuleGranted(key, entitlement)) return false;

  const requires = requirementOf(key, entitlement);

  if (requires.length === 0) return true;

  const seen = new Set(visiting).add(key);

  return requires.some((dep) => isFeatureEnabled(dep, entitlement, seen));
};

/**
 * Whether a config id belongs to a module that is switched off.
 *
 * Lives outside the provider so the tests exercise this exact function rather
 * than a copy of it — a copied traversal stays green while the real one drifts.
 */
export const isModuleExcluded = (
  path: string,
  entitlement?: Amity.ModuleSettings | null,
): boolean => {
  const [page, component, element] = path.split('/');

  // All three segments. Reading only page and component emptied a module's
  // pages while leaving every door into them standing — the Clips tab, the
  // Create Story button and the follow button are elements, and they sit on
  // pages owned by other modules.
  const owners = [
    AMITY_PAGE_MODULE[page],
    AMITY_COMPONENT_MODULE[component],
    AMITY_ELEMENT_MODULE[element],
  ].filter(Boolean) as string[];

  return owners.some((owner) => !isFeatureEnabled(owner, entitlement));
};

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
  /**
   * Core's entitlement read, or null while it is in flight or unavailable.
   *
   * Passed in rather than fetched here: this provider is the only thing that
   * knows the config and it is mounted in places that have no session yet — the
   * visitor-limit page among them — so the fetch belongs one level up, where the
   * client lives.
   */
  entitlement?: Amity.ModuleSettings | null;
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
  entitlement = null,
}) => {
  // Seeded from the prop rather than left null until the effect runs. The
  // config arrives synchronously and only reached state one render later, and
  // the customisations it carries move `isExcluded` the same way a module does:
  // flipping on the *second* render makes every component whose
  // `if (isExcluded) return null` sits above a hook — `useString` inside JSX
  // counts — render fewer hooks than the first time. That is React #300, on
  // first paint.
  const [config, setConfig] = useState<Config | null>(initialConfig ?? null);

  const { currentTheme } = useTheme();

  useEffect(() => {
    if (validateConfig(initialConfig)) {
      const mergedTheme = {
        ...initialConfig?.theme?.[currentTheme],
        ...defaultBaseThemeValue[currentTheme],
      };
      themePropertiesToCSSVar({ theme: mergedTheme });

      // 3-layer color-token system
      // --asc-atomic-* / --asc-color-* vars
      injectColorTokenLayers(mergedTheme, initialConfig?.design_tokens, currentTheme);

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

  // A path is always "pageId/componentId/elementId", and every page, component
  // and element in the UIKit resolves through here. So switching a module off in
  // config.json excludes the pages it owns — and with them everything nested
  // under those pages — by the route the customer's own `excludes` list already
  // takes. No per-page guard to add, and none to forget when the next page lands.
  const isExcluded = (path: string) => {
    if (isModuleExcluded(path, entitlement)) return true;

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
      get(_, prop: string) {
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
    entitlement,
    parseConfig,
    isExcluded,
    getConfig,
  };

  // Install the gate for callers that are not React, so a singleton the
  // provider builds asks the same question a hook does. Set during render, not
  // in an effect: `AdEngine`'s session listener can fire before effects flush,
  // and a gate that arrives late is a gate that let the first fetch through.
  setSdkFnGate((fn) => {
    const owner = moduleOfSdkFn(fn);
    return owner ? isFeatureEnabled(owner, entitlement) : true;
  });

  // Remount the tree when the set of withheld modules changes. Re-rendering in
  // place is not enough: `isExcluded` would flip under components that have
  // already run their hooks once, which is React #300. A different set of
  // modules is a different app, so it gets a different mount.
  //
  // Only the entitlement can move it now. It arrives from the network, so a
  // module can be on for one render and off for the next.
  // `AmityUIKitProvider` holds the tree back until the read settles, so in
  // practice this key changes once, before any child has mounted; it is here
  // so that a host mounting this provider directly is not one async response
  // away from #300.
  const featuresKey = entitlementKey(entitlement);

  return (
    <CustomizationContext.Provider value={contextValue}>
      <React.Fragment key={featuresKey}>{children}</React.Fragment>
    </CustomizationContext.Provider>
  );
};
