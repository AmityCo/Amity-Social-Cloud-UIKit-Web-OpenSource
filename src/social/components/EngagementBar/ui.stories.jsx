import React from 'react';
import { useArgs } from '@storybook/client-api';

import UIEngagementBar from './UIEngagementBar';

export default {
  title: 'Ui Only/Social/Post',
};

export const UiEngagementBar = {
  render: () => {
    const [{ isComposeBarDisplayed, onClickComment, ...props }, updateArgs] = useArgs();

    const handleDisplayComposeBar = () => {
      onClickComment();
      updateArgs({ isComposeBarDisplayed: !isComposeBarDisplayed });
    };

    return <UIEngagementBar {...props} onClickComment={handleDisplayComposeBar} />;
  },

  name: 'Engagement Bar',

  args: {
    postId: '',
    totalLikes: 0,
    totalComments: 0,
    readonly: false,
    isComposeBarDisplayed: false,
  },

  argTypes: {
    onClickComment: { action: 'onClickComment()' },
    handleAddComment: { action: 'handleAddComment(commentText)' },
  },
};
