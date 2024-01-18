import React from 'react';
import { useArgs } from '@storybook/client-api';

import StyledCommentLikeButton from './styles';

export default {
  title: 'Ui Only/Social/Comment',
};

export const UiCommentLikeButton = {
  render: () => {
    const [{ isActive, totalLikes, isDisabled }, updateArgs] = useArgs();
    const toggleLike = () =>
      updateArgs({
        isActive: !isActive,
        totalLikes: isActive ? totalLikes - 1 : totalLikes + 1,
      });
    return (
      <StyledCommentLikeButton
        isActive={isActive}
        isDisabled={isDisabled}
        totalLikes={totalLikes}
        onClick={toggleLike}
      />
    );
  },

  name: 'Like button',

  args: {
    isActive: false,
    isDisabled: false,
    totalLikes: 0,
  },

  argTypes: {
    isActive: { control: { type: 'boolean' } },
    isDisabled: { control: { type: 'boolean' } },
    onClick: { action: 'onClick()' },
    totalLikes: { control: { type: 'number', min: 0 } },
  },
};
