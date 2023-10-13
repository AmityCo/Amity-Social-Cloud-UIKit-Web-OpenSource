import React from 'react';
import { ChannelMembership } from '@amityco/js-sdk';

import RecentChatOnly from '.';

export default {
  title: 'SDK Connected/Chat',
};

export const RecentChatStory = (args) => {
  return <RecentChatOnly {...args} />;
};

RecentChatStory.storyName = 'RecentChat';

RecentChatStory.args = {
  membershipFilter: ChannelMembership.Member,
  defaultChannelId: '',
};

RecentChatStory.argTypes = {
  defaultChannelId: { control: { type: 'text' } },
  membershipFilter: {
    control: { type: 'select' },
    options: Object.values(ChannelMembership),
  },
};
