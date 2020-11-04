import React from 'react';
import useOneCommunity from '~/mock/useOneCommunity';
import TrendingItem from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SdkTrendingItem = props => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <TrendingItem communityId={community.communityId} {...props} />;
};

SdkTrendingItem.storyName = 'Trending Item';

SdkTrendingItem.argTypes = {
  onClick: { action: 'onClick(communityId)' },
};
