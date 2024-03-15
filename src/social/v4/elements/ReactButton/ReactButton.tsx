import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { Icon } from '~/core/v4/components/Icon';
import { UIReactButton, UIRemoteImageButton } from './styles';
import { useTheme } from 'styled-components';

interface ReactButtonProps {
  isLiked: boolean;
  pageId?: 'story_page';
  componentId?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
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
        src={likedIcon}
        onClick={onClick}
        style={{
          ...style,
          backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
        }}
        {...props}
      >
        {children}
      </UIRemoteImageButton>
    ) : (
      <UIReactButton onClick={onClick} {...props}>
        <Icon name={likedIcon || 'LikedIcon'} />
        {children}
      </UIReactButton>
    )
  ) : isUnlikedRemoteImage ? (
    <UIRemoteImageButton
      src={unlikedIcon}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      {...props}
    >
      {children}
    </UIRemoteImageButton>
  ) : (
    <UIReactButton onClick={onClick} {...props}>
      <Icon name={unlikedIcon || 'LikeIcon'} />
      {children}
    </UIReactButton>
  );
};
