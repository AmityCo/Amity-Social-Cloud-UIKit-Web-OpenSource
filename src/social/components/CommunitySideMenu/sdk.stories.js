import React from 'react';

import UiKitCommunitySideMenu from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunitySideMenu = ({ ...args }) => <UiKitCommunitySideMenu {...args} />;

SDKCommunitySideMenu.storyName = 'Side menu';

SDKCommunitySideMenu.args = {
  newsFeedActive: false,
  exploreActive: false,
  showCreateCommunityButton: true,
  searchInputPlaceholder: 'Search',
  shouldHideExplore: false,
};

SDKCommunitySideMenu.argTypes = {
  onClickCreateCommunity: { action: 'onClickCreateCommunity()' },
  onClickCommunity: { action: 'onClickCommunity()' },
  onClickNewsFeed: { action: 'onClickNewsFeed()' },
  onClickExplore: { action: 'onClickExplore()' },
  onSearchResultCommunityClick: { action: 'onSearchResultCommunityClick()' },
};
