import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { IconButton, RemoteImageButton } from './styles';
import { ArrowLeftCircle2 } from '~/icons';
import { isValidHttpUrl } from '~/utils';
import { useTheme } from 'styled-components';

interface BackButtonProps {
  pageId: 'story_page';
  componentId: '*';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
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
  const createStoryIcon = elementConfig?.create_story_icon;

  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const isRemoteImage = createStoryIcon && isValidHttpUrl(createStoryIcon);

  return isRemoteImage ? (
    <RemoteImageButton
      src={createStoryIcon}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
    />
  ) : (
    <IconButton
      name={createStoryIcon || <ArrowLeftCircle2 />}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      onClick={onClick}
    />
  );
};
