import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { UICloseButton, UIRemoteImageButton } from './styles';
import { isValidHttpUrl } from '~/utils';
import { useTheme } from 'styled-components';

interface CloseButtonProps {
  pageId: 'story_page';
  componentId: '*';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  'data-qa-anchor'?: string;
}

export const CloseButton = ({
  pageId = 'story_page',
  componentId = '*',
  onClick = () => {},
  style,
  ...props
}: CloseButtonProps) => {
  const elementId = 'close_button';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);
  const closeIcon = elementConfig?.close_icon;

  if (isElementExcluded) return null;

  const isRemoteImage = closeIcon && isValidHttpUrl(closeIcon);

  return isRemoteImage ? (
    <UIRemoteImageButton
      data-qa-anchor="close_button"
      src={closeIcon}
      onClick={onClick}
      {...props}
    />
  ) : (
    <UICloseButton
      data-qa-anchor="close_button"
      name={closeIcon === 'close' ? 'Close' : closeIcon}
      onClick={onClick}
      {...props}
    />
  );
};
