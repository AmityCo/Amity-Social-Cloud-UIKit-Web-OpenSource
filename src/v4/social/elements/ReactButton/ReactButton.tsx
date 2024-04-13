import React from 'react';
import { Icon } from '~/v4/core/components/';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { UIReactButton, UIRemoteImageButton } from './styles';
import { useTheme } from 'styled-components';

interface ReactButtonProps {
  isLiked: boolean;
  pageId?: 'story_page';
  componentId?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  'data-qa-anchor'?: string;
}

export const ReactButton = ({
  isLiked,
  pageId = 'story_page',
  componentId = '*',
  onClick = () => {},
  style,
  children,
  ...props
}: ReactButtonProps) => {
  const theme = useTheme();
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/*/story_reaction_button`);
  const isElementExcluded = isExcluded(`${pageId}/*/story_reaction_button`);
  const backgroundColor = elementConfig.background_color;
  const likedIcon = elementConfig.liked_icon;
  const unlikedIcon = elementConfig.unliked_icon;

  if (isElementExcluded) return null;

  const isLikedRemoteImage =
    likedIcon && (likedIcon.startsWith('http://') || likedIcon.startsWith('https://'));

  const isUnlikedRemoteImage =
    unlikedIcon && (unlikedIcon.startsWith('http://') || unlikedIcon.startsWith('https://'));

  return isLiked ? (
    isLikedRemoteImage ? (
      <UIRemoteImageButton
        data-qa-anchor="reaction_button"
        src={likedIcon}
        onClick={onClick}
        style={{
          ...style,
          backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
        }}
        {...props}
      >
        <span data-qa-anchor="reaction_button_text_view">{children}</span>
      </UIRemoteImageButton>
    ) : (
      <UIReactButton data-qa-anchor="reaction_button" onClick={onClick} {...props}>
        <Icon name={likedIcon || 'LikedIcon'} />
        <span data-qa-anchor="reaction_button_text_view">{children}</span>
      </UIReactButton>
    )
  ) : isUnlikedRemoteImage ? (
    <UIRemoteImageButton
      data-qa-anchor="reaction_button"
      src={unlikedIcon}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      {...props}
    >
      <span data-qa-anchor="reaction_button_text_view">{children}</span>
    </UIRemoteImageButton>
  ) : (
    <UIReactButton data-qa-anchor="reaction_button" onClick={onClick} {...props}>
      <Icon name={unlikedIcon || 'LikeIcon'} />
      <span data-qa-anchor="reaction_button_text_view">{children}</span>
    </UIReactButton>
  );
};
