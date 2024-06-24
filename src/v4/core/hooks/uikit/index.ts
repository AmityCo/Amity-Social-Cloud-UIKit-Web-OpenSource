import { getDefaultConfig, useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useGenerateStylesShadeColors, useTheme } from '~/v4/core/providers/ThemeProvider';

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
  const currentTheme = useTheme();

  return {
    currentTheme,
    config,
    defaultConfig,
    uiReference,
    accessibilityId,
    themeStyles,
    isExcluded: isComponentExcluded,
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
