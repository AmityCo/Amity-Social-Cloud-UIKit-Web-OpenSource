import React from 'react';

import ChatApplication from '.';

export default {
  title: 'SDK Connected/Chat',
};

export const ChatApplicationStory = {
  render: (props) => {
    return <ChatApplication {...props} />;
  },

  name: 'Application',

  args: {
    membershipFilter: 'member',
    defaultChannelId: '',
  },

  argTypes: {
    defaultChannelId: { control: { type: 'text' } },
    membershipFilter: {
      control: { type: 'select' },
      options: ['member', 'banned', 'muted', 'non-member', 'deleted'],
    },
  },
};
