import React from 'react';
import useOneCommunity from '~/mock/useOneCommunity';
import CommunityPage from '.';

export default {
  title: 'Components/Community/Page',
};

export const Basic = props => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <CommunityPage communityId={community.communityId} {...props} />;
};

Basic.args = {
  shouldHideTabs: false,
};

Basic.argTypes = {
  shouldHideTabs: { control: { type: 'boolean' } },
};
