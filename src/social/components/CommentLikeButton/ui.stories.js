import React from 'react';
import { useArgs } from '@storybook/client-api';

import StyledCommentLikeButton from './styles';

export default {
  title: 'Ui Only/Social/Comment',
};

export const UiCommentLikeButton = ({ isDisabled }) => {
  const [{ isActive, totalLikes }, updateArgs] = useArgs();
  const toggleLike = () =>
    updateArgs({
      isActive: !isActive,
      totalLikes: isActive ? totalLikes - 1 : totalLikes + 1,
    });
  return (
    <StyledCommentLikeButton
      onClick={toggleLike}
      isActive={isActive}
      isDisabled={isDisabled}
      totalLikes={totalLikes}
    />
  );
};

UiCommentLikeButton.storyName = 'Like button';

UiCommentLikeButton.args = {
  isActive: false,
  isDisabled: false,
  totalLikes: 0,
};

UiCommentLikeButton.argTypes = {
  isActive: { control: { type: 'boolean' } },
  isDisabled: { control: { type: 'boolean' } },
  onClick: { action: 'onClick()' },
  totalLikes: { control: { type: 'number', min: 0 } },
};
