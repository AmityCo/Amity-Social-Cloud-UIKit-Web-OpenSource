import React from 'react';

import UiKitCommunitySideMenu from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunitySideMenu = ({ ...args }) => <UiKitCommunitySideMenu {...args} />;

SDKCommunitySideMenu.storyName = 'Side menu';

SDKCommunitySideMenu.args = {
  exploreActive: false,
  newsFeedActive: false,
};

SDKCommunitySideMenu.argTypes = {
  onClickExplore: { action: 'onClickExplore()' },
  onClickNewsFeed: { action: 'onClickNewsFeed()' },
  onClickCommunity: { action: 'onClickCommunity(communityId)' },
  onCommunityCreated: { action: 'onCommunityCreated(communityId)' },
};
