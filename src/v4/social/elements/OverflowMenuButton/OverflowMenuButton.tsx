import React from 'react';

import { UIOverflowButton, RemoteImageButton } from './styles';
import { isValidHttpUrl } from '~/utils';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';

interface OverflowMenuButtonProps {
  pageId?: 'story_page';
  componentId?: '*';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  'data-qa-anchor'?: string;
}

export const OverflowMenuButton = ({
  pageId = 'story_page',
  componentId = '*',
  onClick = () => {},
  style,
  ...props
}: OverflowMenuButtonProps) => {
  const elementId = 'overflow_menu';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const overflowMenuIcon = elementConfig?.overflow_menu_icon;
  const isRemoteImage = overflowMenuIcon && isValidHttpUrl(overflowMenuIcon);

  return isRemoteImage ? (
    <RemoteImageButton
      data-qa-anchor="overflow_menu_button"
      src={overflowMenuIcon}
      onClick={onClick}
      {...props}
    />
  ) : (
    <UIOverflowButton
      data-qa-anchor="overflow_menu_button"
      name={'EllipsisH'}
      onClick={onClick}
      {...props}
    />
  );
};
