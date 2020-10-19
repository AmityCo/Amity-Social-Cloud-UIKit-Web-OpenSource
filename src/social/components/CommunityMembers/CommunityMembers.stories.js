import React from 'react';
import useOneCommunity from '~/mock/useOneCommunity';
import CommunityMembers from '.';

export default {
  title: 'Components/Community/Members',
};

export const Basic = args => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <CommunityMembers communityId={community.communityId} {...args} />;
};

Basic.argTypes = {
  onMemberClick: { action: 'Member clicked' },
};
