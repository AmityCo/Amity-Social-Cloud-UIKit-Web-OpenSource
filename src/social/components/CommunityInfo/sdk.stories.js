import React from 'react';

import useOneCommunity from '~/mock/useOneCommunity';

import UiKitCommunityInfo from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityInfo = () => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <UiKitCommunityInfo communityId={community.communityId} />;
};

SDKCommunityInfo.storyName = 'Informations';
