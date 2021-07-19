import React from 'react';
import { MessageType } from '@amityco/js-sdk';

import Message from '.';

export default {
  title: 'Ui Only/Chat/Message',
};

export const UIMessage = ({ createdAt, ...restArgs }) => {
  const normalizedCreatedAt = new Date(createdAt);
  return <Message createdAt={normalizedCreatedAt} {...restArgs} />;
};

UIMessage.storyName = 'Message';

UIMessage.args = {
  messageId: '',
  type: MessageType.Text,
  data: {
    text:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
  },
  createdAt: new Date(),
  userDisplayName: 'Test User',
  isDeleted: false,
  isIncoming: false,
  isConsequent: false,
};

UIMessage.argTypes = {
  messageId: { control: { disable: true } },
  type: { control: { type: 'select', options: Object.values(MessageType) } },
  createdAt: { control: { type: 'date' } },
};
