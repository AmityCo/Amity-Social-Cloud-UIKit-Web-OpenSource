import React from 'react';

import useOneCommunity from '~/mock/useOneCommunity';

import UiKitCommunityMembers from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityMembers = args => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <UiKitCommunityMembers communityId={community.communityId} {...args} />;
};

SDKCommunityMembers.storyName = 'Member list';

SDKCommunityMembers.argTypes = {
  onClickUser: { action: 'onClickUser(userId)' },
};
