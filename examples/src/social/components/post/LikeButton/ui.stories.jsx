import React from 'react';
import { useArgs } from '@storybook/client-api';

import UIPostLikeButton from './UILikeButton';

export default {
  title: 'Ui Only/Social/Post',
};

export const UiPostLikeButton = {
  render: () => {
    const [{ isDisabled }] = useArgs();
    const [{ isActive }, updateArgs] = useArgs();
    const toggleLike = () => updateArgs({ isActive: !isActive });
    return <UIPostLikeButton isActive={isActive} isDisabled={isDisabled} onClick={toggleLike} />;
  },

  name: 'Like button',
};
