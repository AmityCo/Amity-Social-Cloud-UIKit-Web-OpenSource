import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { Icon } from '~/core/v4/components/Icon';
import { UICommentButton, UIRemoteImageButton } from './styles';
import { isValidHttpUrl } from '~/utils';
import { useTheme } from 'styled-components';

interface ReactButtonProps {
  pageId: 'story_page';
  componentId: '*';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const CommentButton = ({
  pageId = 'story_page',
  componentId = '*',
  onClick = () => {},
  style,
  children,
  ...props
}: ReactButtonProps) => {
  const theme = useTheme();
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/*/story_comment_button`);
  const isElementExcluded = isExcluded(`${pageId}/*/story_comment_button`);
  const backgroundColor = elementConfig.background_color;
  const commentIcon = elementConfig.comment_icon;

  if (isElementExcluded) return null;

  const isRemoteImage = commentIcon && isValidHttpUrl(commentIcon);

  return isRemoteImage ? (
    <UIRemoteImageButton
      src={commentIcon}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      {...props}
    />
  ) : (
    <UICommentButton
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      {...props}
    >
      <Icon name={commentIcon === 'comment' ? 'Comment2Icon' : commentIcon} />
      {children}
    </UICommentButton>
  );
};
