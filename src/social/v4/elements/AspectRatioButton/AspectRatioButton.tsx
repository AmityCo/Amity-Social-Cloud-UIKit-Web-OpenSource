import React from 'react';

import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { ActionButton, CustomActionButton } from './styles';
import { useTheme } from 'styled-components';
import { isValidHttpUrl } from '~/utils';

interface AspectRatioButtonProps {
  onClick: () => void;
  pageId: 'create_story_page';
  componentId: '*';
  style?: React.CSSProperties;
  'data-qa-anchor'?: string;
}

export const AspectRatioButton = ({
  pageId = 'create_story_page',
  componentId = '*',
  onClick = () => {},
  style,
  ...props
}: AspectRatioButtonProps) => {
  const theme = useTheme();

  const elementId = 'aspect_ratio_button';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);
  const aspectRatioIcon = elementConfig?.aspect_ratio_icon;

  if (isElementExcluded) return null;

  const isRemoteImage = aspectRatioIcon && isValidHttpUrl(aspectRatioIcon);

  return isRemoteImage ? (
    <CustomActionButton
      data-qa-anchor="aspect_ratio_button"
      src={aspectRatioIcon}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: elementConfig?.background_color || theme.v4.colors.secondary.default,
      }}
      {...props}
    />
  ) : (
    <ActionButton
      data-qa-anchor="aspect_ratio_button"
      name={aspectRatioIcon === 'aspect_ratio' ? 'ExpandIcon' : aspectRatioIcon}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: elementConfig?.background_color || theme.v4.colors.secondary.default,
      }}
      {...props}
    />
  );
};
