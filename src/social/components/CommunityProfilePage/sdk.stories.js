import React from 'react';

import useOneCommunity from '~/mock/useOneCommunity';

import CommunityProfilePage from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityProfilePage = props => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <CommunityProfilePage communityId={community.communityId} {...props} />;
};

SDKCommunityProfilePage.storyName = 'Profile Page';
