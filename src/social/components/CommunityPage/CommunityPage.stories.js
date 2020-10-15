import React from 'react';
import useOneCommunity from '~/mock/useOneCommunity';
import CommunityPage from '.';

export default {
  title: 'Components/Community/Page',
};

export const Basic = () => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <CommunityPage communityId={community.communityId} />;
};
