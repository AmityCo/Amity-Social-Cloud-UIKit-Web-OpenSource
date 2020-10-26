import React from 'react';

import StyledComment from './Comment.styles';

export default {
  title: 'Ui Only/Social/Comment',
};

export const UiComment = args => {
  return <StyledComment {...args} />;
};

UiComment.storyName = 'Single Comment';

UiComment.args = {
  authorName: 'Test Author',
  authorAvatar: '',
  createdAt: '9/28/20',
  text: 'Dynamic comment text',
  isReplyComment: false,
};

UiComment.argTypes = {
  authorName: { control: { type: 'text' } },
  authorAvatar: { control: { type: 'text' } },
  createdAt: { control: { type: 'text' } },
  text: { control: { type: 'text' } },
  isReplyComment: { control: { type: 'boolean' } },
  onClickReply: { action: 'onClickReply()' },
  handleReportComment: { action: 'handleReportComment()' },
};
