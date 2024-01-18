import React from 'react';
import { FormattedMessage } from 'react-intl';
import { LikeIcon, StyledLikeButton } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface UIPostLikeButtonProps {
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

/**
 * This can be customised by a ui-kit user.
 * They can replace it with any other presentational component with the same props interface.
 */
const UIPostLikeButton = ({ onClick, isActive, isDisabled }: UIPostLikeButtonProps) => (
  <StyledLikeButton
    active={isActive}
    disabled={isDisabled}
    data-qa-anchor={isActive ? 'post-liked-button' : 'post-like-button'}
    onClick={onClick}
  >
    <LikeIcon isLiked={isActive} /> <FormattedMessage id={isActive ? 'post.liked' : 'post.like'} />
  </StyledLikeButton>
);

export default (props: UIPostLikeButtonProps) => {
  const CustomComponentFn = useCustomComponent<UIPostLikeButtonProps>('PostLikeButton');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UIPostLikeButton {...props} />;
};
