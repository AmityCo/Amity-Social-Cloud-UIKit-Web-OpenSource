import React from 'react';

import useOneCommunity from '~/mock/useOneCommunity';

import UiKitCommunityCard from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityCard = () => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <UiKitCommunityCard communityId={community.communityId} />;
};

SDKCommunityCard.storyName = 'Card';
