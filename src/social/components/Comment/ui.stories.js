import React from 'react';

import StyledComment from './Comment.styles';

export default {
  title: 'Ui Only/Social/Comment',
};

export const UiComment = ({ createdAt, editedAt, ...restArgs }) => {
  const normalizedCreatedAt = new Date(createdAt);
  const normalizedEditedAt = new Date(editedAt);

  return (
    <StyledComment createdAt={normalizedCreatedAt} editedAt={normalizedEditedAt} {...restArgs} />
  );
};

UiComment.storyName = 'Single Comment';

UiComment.args = {
  authorName: 'Test Author',
  authorAvatar: '',
  canDelete: true,
  canEdit: true,
  canLike: true,
  canReply: true,
  canReport: true,
  createdAt: new Date('9/28/20'),
  editedAt: new Date('9/29/20'),
  text: 'Dynamic **comment** text with [link](https://www.google.com).',
};

UiComment.argTypes = {
  authorName: { control: { type: 'text' } },
  authorAvatar: { control: { type: 'text' } },
  canDelete: { control: { type: 'boolean' } },
  canEdit: { control: { type: 'boolean' } },
  canLike: { control: { type: 'boolean' } },
  canReply: { control: { type: 'boolean' } },
  canReport: { control: { type: 'boolean' } },
  createdAt: { control: { type: 'date' } },
  editedAt: { control: { type: 'date' } },
  text: { control: { type: 'text' } },
  onClickReply: { action: 'onClickReply()' },
  handleReportComment: { action: 'handleReportComment()' },
};
