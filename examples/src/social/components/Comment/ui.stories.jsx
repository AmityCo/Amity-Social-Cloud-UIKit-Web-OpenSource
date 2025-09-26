import React from 'react';

import StyledComment from './StyledComment';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Social/Comment',
};

export const UiComment = {
  render: () => {
    const [{ createdAt, editedAt, ...restArgs }] = useArgs();
    const normalizedCreatedAt = new Date(createdAt);
    const normalizedEditedAt = new Date(editedAt);

    return (
      <StyledComment createdAt={normalizedCreatedAt} editedAt={normalizedEditedAt} {...restArgs} />
    );
  },

  name: 'Single Comment',

  args: {
    authorName: 'Test Author',
    authorAvatar: '',
    canDelete: true,
    canEdit: true,
    canLike: true,
    canReply: true,
    canReport: true,
    createdAt: new Date('9/28/20'),
    editedAt: new Date('9/29/20'),
    text: 'Dynamic comment text',
  },

  argTypes: {
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
  },
};
