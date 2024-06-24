import React from 'react';
import useOneCommunity from '~/mock/useOneCommunity';

import { CommunityAvatar } from './CommunityAvatar';

export default {
  title: 'v4-social/elements/CommunityAvatar',
};

export const CommunityAvatarStory = {
  render: () => {
    const [community, isLoading] = useOneCommunity();

    if (community == null || isLoading) {
      return null;
    }

    return <CommunityAvatar community={community} />;
  },

  name: 'CommunityAvatar',
};
