import React from 'react';
import { useArgs } from '@storybook/client-api';

import UIEngagementBar from './UIEngagementBar';

export default {
  title: 'Ui Only/Social/Post',
};

export const UiEngagementBar = ({ onClickComment, ...props }) => {
  const [{ isCommentComposeOpen }, updateArgs] = useArgs();

  const handleOpenComment = () => {
    onClickComment();
    updateArgs({ isCommentComposeOpen: !isCommentComposeOpen });
  };

  return <UIEngagementBar {...props} onClickComment={handleOpenComment} />;
};

UiEngagementBar.storyName = 'Engagement Bar';

UiEngagementBar.args = {
  postId: '',
  totalLikes: 0,
  totalComments: 0,
  noInteractionMessage: '',
  isCommentComposeOpen: false,
  commentIds: [],
};

UiEngagementBar.argTypes = {
  onClickComment: { action: 'onClickComment()' },
  handleAddComment: { action: 'handleAddComment(commentText)' },
};
