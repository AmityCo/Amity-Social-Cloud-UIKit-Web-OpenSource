import React from 'react';
import { useArgs } from '@storybook/client-api';

import UIEngagementBar from './UIEngagementBar';

export default {
  title: 'Ui Only/Social/Post',
};

export const UiEngagementBar = ({ onClickComment, ...props }) => {
  const [{ isComposeBarDisplayed }, updateArgs] = useArgs();

  const handleDisplayComposeBar = () => {
    onClickComment();
    updateArgs({ isComposeBarDisplayed: !isComposeBarDisplayed });
  };

  return <UIEngagementBar {...props} onClickComment={handleDisplayComposeBar} />;
};

UiEngagementBar.storyName = 'Engagement Bar';

UiEngagementBar.args = {
  postId: '',
  totalLikes: 0,
  totalComments: 0,
  readonly: false,
  isComposeBarDisplayed: false,
};

UiEngagementBar.argTypes = {
  onClickComment: { action: 'onClickComment()' },
  handleAddComment: { action: 'handleAddComment(commentText)' },
};
