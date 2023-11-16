import React from 'react';
import { useArgs } from '@storybook/client-api';

import StyledPostLikeButton from './styles';

export default {
  title: 'Ui Only/Social/Post',
};

export const UiPostLikeButton = ({ isDisabled }) => {
  const [{ isActive }, updateArgs] = useArgs();
  const toggleLike = () => updateArgs({ isActive: !isActive });
  return <StyledPostLikeButton isActive={isActive} isDisabled={isDisabled} onClick={toggleLike} />;
};

UiPostLikeButton.storyName = 'Like button';
