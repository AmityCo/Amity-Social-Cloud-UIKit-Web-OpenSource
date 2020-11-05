import React from 'react';

import useOneCommunity from '~/mock/useOneCommunity';

import CommunityProfilePage from '.';

export default {
  title: 'SDK Connected/Social/Pages',
};

export const SDKCommunityProfilePage = props => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <CommunityProfilePage communityId={community.communityId} {...props} />;
};

SDKCommunityProfilePage.argTypes = {
  onClickUser: { action: 'onClickUser(userId)' },
};

SDKCommunityProfilePage.storyName = 'Community Profile Page';
