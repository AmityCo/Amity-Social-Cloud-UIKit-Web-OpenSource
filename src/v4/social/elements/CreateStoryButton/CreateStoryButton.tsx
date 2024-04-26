import React from 'react';

import { IconButton, RemoteImageButton } from './styles';
import { isValidHttpUrl } from '~/utils';
import { useTheme } from 'styled-components';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';

interface BackButtonProps {
  pageId: 'story_page';
  componentId: '*';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  'data-qa-anchor'?: string;
}

export const CreateStoryButton = ({
  pageId = 'story_page',
  componentId = '*',
  onClick = () => {},
  style,
}: BackButtonProps) => {
  const theme = useTheme();
  const elementId = 'create_new_story_button';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const backgroundColor = elementConfig?.background_color;
  const createStoryIcon = elementConfig?.create_new_story_icon;

  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const isRemoteImage = createStoryIcon && isValidHttpUrl(createStoryIcon);

  return isRemoteImage ? (
    <RemoteImageButton
      data-qa-anchor="create_story_icon"
      src={createStoryIcon}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
    />
  ) : (
    <IconButton
      data-qa-anchor="create_story_icon"
      name={'AddIcon'}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      onClick={onClick}
    />
  );
};
