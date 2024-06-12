import React from 'react';

import { CommunityMembersCount } from './CommunityMembersCount';

export default {
  title: 'v4-social/elements/CommunityMembersCount',
};

export const CreateCommunityButtonStory = {
  render: () => {
    return <CommunityMembersCount memberCount={20} />;
  },

  name: 'CommunityMembersCount',
};
