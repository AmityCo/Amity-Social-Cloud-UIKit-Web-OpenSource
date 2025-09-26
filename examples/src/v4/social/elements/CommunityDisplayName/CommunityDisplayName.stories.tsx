import React from 'react';
import useOneCommunity from '~/mock/useOneCommunity';

import { CommunityDisplayName } from './CommunityDisplayName';

export default {
  title: 'v4-social/elements/CommunityDisplayName',
};

export const CreateCommunityButtonStory = {
  render: () => {
    const [community] = useOneCommunity();

    if (community == null) {
      return null;
    }

    return <CommunityDisplayName community={community} />;
  },

  name: 'CommunityDisplayName',
};
