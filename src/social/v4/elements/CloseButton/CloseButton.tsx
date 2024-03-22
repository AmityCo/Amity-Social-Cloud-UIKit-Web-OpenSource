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
    <UIRemoteImageButton src={closeIcon} onClick={onClick} {...props} />
  ) : (
    <UICloseButton
      name={closeIcon === 'close' ? 'Close' : closeIcon}
      onClick={onClick}
      {...props}
    />
  );
};
