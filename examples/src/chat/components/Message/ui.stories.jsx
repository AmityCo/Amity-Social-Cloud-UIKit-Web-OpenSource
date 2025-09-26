import React from 'react';

import Message from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Chat/Message',
};

export const UIMessage = {
  render: () => {
    const [{ createdAt, ...restArgs }] = useArgs();
    const normalizedCreatedAt = new Date(createdAt);
    return <Message createdAt={normalizedCreatedAt} {...restArgs} />;
  },

  name: 'Message',

  args: {
    messageId: '',
    type: 'text',
    data: {
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
    },
    createdAt: new Date(),
    userDisplayName: 'Test User',
    isDeleted: false,
    isIncoming: false,
    isConsequent: false,
  },

  argTypes: {
    messageId: { control: { disable: true } },
    type: { control: { type: 'select' }, options: Object.values(['text', 'custom']) },
    createdAt: { control: { type: 'date' } },
  },
};
