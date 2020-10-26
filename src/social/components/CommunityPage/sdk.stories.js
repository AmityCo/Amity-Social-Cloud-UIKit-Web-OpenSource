import React from 'react';

import useOneCommunity from '~/mock/useOneCommunity';

import UiKitCommunityPage from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKPage = props => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return <UiKitCommunityPage communityId={community.communityId} {...props} />;
};

SDKPage.storyName = 'Page';

SDKPage.args = {
  shouldHideTabs: false,
};

SDKPage.argTypes = {
  shouldHideTabs: { control: { type: 'boolean' } },
};
