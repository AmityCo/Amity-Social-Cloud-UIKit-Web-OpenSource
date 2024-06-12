import React from 'react';

import { UICloseButton, UIRemoteImageButton } from './styles';
import { isValidHttpUrl } from '~/utils';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';

interface CloseButtonProps {
  pageId: string;
  componentId: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  'data-qa-anchor'?: string;
}

export const CloseButton = ({
  pageId = '*',
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
    <UICloseButton data-qa-anchor="close_button" name={'Close'} onClick={onClick} {...props} />
  );
};
