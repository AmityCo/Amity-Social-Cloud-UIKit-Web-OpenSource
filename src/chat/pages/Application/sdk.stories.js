import React from 'react';
import { ChannelMembership } from '@amityco/js-sdk';

import ChatApplication from '.';

export default {
  title: 'SDK Connected/Chat',
};

export const ChatApplicationStory = args => {
  return <ChatApplication {...args} />;
};

ChatApplicationStory.storyName = 'Application';

ChatApplicationStory.args = {
  membershipFilter: ChannelMembership.Member,
  defaultChannelId: '',
};

ChatApplicationStory.argTypes = {
  defaultChannelId: { control: { type: 'text' } },
  membershipFilter: {
    control: {
      type: 'select',
      options: Object.values(ChannelMembership),
    },
  },
};
