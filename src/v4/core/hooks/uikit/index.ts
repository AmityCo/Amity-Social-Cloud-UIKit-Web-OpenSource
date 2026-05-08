import { getDefaultConfig, useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useGenerateStylesShadeColors, useTheme } from '~/v4/core/providers/ThemeProvider';
import { resolveString, type FormatArg } from '~/v4/core/localization';

export const useAmityElement = ({
  pageId,
  componentId,
  elementId,
}: {
  pageId: string;
  componentId: string;
  elementId: string;
}) => {
  const uiReference = `${pageId}/${componentId}/${elementId}`;
  const { getConfig, isExcluded } = useCustomization();
  const config = getConfig(uiReference);
  const defaultConfig = getDefaultConfig(uiReference);
  const themeStyles = useGenerateStylesShadeColors(config);
  const isComponentExcluded = isExcluded(uiReference);
  const accessibilityId = uiReference;
  const { currentTheme } = useTheme();

  /**
   * Resolve a localized string for this element.
   *
   * Priority (per spec §1):
   *   Level 1: config.text (remote config.json override) — wins when non-empty
   *   Level 2–5: resolveString(key) — override → locale bundle → library default → key fallback
   *
   * @param key        Canonical amity_* localization key
   * @param formatArgs Optional positional format arguments (%s / %d / %@)
   */
  const resolveText = (key: string, ...formatArgs: FormatArg[]): string => {
    if (config.text != null && config.text !== '') return config.text;
    return resolveString(key, ...formatArgs);
  };

  return {
    currentTheme,
    config,
    defaultConfig,
    uiReference,
    accessibilityId,
    themeStyles,
    isExcluded: isComponentExcluded,
    resolveText,
  };
};

export const useAmityComponent = ({
  pageId,
  componentId,
}: {
  pageId: string;
  componentId: string;
}) => {
  const elementId = '*';
  return useAmityElement({ pageId, componentId, elementId });
};

export const useAmityPage = ({ pageId }: { pageId: string }) => {
  const componentId = '*';
  const elementId = '*';

  return useAmityElement({ pageId, componentId, elementId });
};
