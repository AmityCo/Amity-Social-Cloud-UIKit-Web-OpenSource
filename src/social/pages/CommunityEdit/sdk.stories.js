import React from 'react';

import useOneCommunity from '~/mock/useOneCommunity';
import CommunityEdit from '.';

export default {
  title: 'SDK Connected/Social/Pages',
};

export const SDKCommunityEdit = props => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <CommunityEdit {...props} communityId={community.communityId} />;
};

SDKCommunityEdit.storyName = 'Community Edit';
