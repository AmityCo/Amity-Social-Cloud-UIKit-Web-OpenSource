import React from 'react';

import { ActionButton, CustomActionButton } from './styles';

import { isValidHttpUrl } from '~/utils';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';

interface AspectRatioButtonProps {
  onClick: () => void;
  pageId: 'create_story_page';
  componentId: '*';
  'data-qa-anchor'?: string;
}

export const AspectRatioButton = ({
  pageId = 'create_story_page',
  componentId = '*',
  onClick = () => {},
  ...props
}: AspectRatioButtonProps) => {
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
      {...props}
    />
  ) : (
    <ActionButton
      data-qa-anchor="aspect_ratio_button"
      name={'ExpandIcon'}
      onClick={onClick}
      {...props}
    />
  );
};
