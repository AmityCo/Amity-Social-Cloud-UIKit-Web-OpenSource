import React from 'react';
import useOneCommunity from '~/mock/useOneCommunity';

import { CommunitySearchResult } from './CommunitySearchResult';

export default {
  title: 'v4-social/components/CommunitySearchResult',
};

export const CommunitySearchResultStory = {
  render: () => {
    const [community] = useOneCommunity();

    if (community == null) return null;

    return <CommunitySearchResult communityCollection={[community]} onLoadMore={() => {}} />;
  },

  name: 'CommunitySearchResult',
};
