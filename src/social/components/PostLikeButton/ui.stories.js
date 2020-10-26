import React from 'react';
import { useArgs } from '@storybook/client-api';

import StyledPostLikeButton from './styles';

export default {
  title: 'Ui Only/Social/Post',
};

export const UiPostLikeButton = ({ isDisabled }) => {
  const [{ isActive }, updateArgs] = useArgs();
  const toggleLike = () => updateArgs({ isActive: !isActive });
  return <StyledPostLikeButton onClick={toggleLike} isActive={isActive} isDisabled={isDisabled} />;
};

UiPostLikeButton.storyName = 'Like button';
