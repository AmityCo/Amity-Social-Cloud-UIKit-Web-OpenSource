import React from 'react';
import { Icon } from '~/v4/core/components';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { isValidHttpUrl } from '~/utils';
import { useTheme } from 'styled-components';
import styles from './CommentButton.module.css';

interface ReactButtonProps {
  pageId: 'story_page';
  componentId: '*';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  'data-qa-anchor'?: string;
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
  const backgroundColor = elementConfig?.background_color;
  const commentIcon = elementConfig?.comment_icon;

  if (isElementExcluded) return null;

  const isRemoteImage = commentIcon && isValidHttpUrl(commentIcon);

  return isRemoteImage ? (
    <img
      data-qa-anchor="comment_button"
      src={commentIcon}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      className={styles.uiRemoteImageButton}
      {...props}
    />
  ) : (
    <button
      data-qa-anchor="comment_button"
      onClick={onClick}
      className={styles.uiCommentButton}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      {...props}
    >
      <Icon name={commentIcon === 'comment' ? commentIcon : 'Comment2Icon'} />
      <span data-qa-anchor="comment_button_text_view">{children}</span>
    </button>
  );
};
