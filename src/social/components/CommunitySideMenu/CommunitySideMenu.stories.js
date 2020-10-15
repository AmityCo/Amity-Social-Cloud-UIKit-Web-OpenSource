import React from 'react';

import CommunitySideMenu from '.';

export default {
  title: 'Components/Community/SideMenu/Menu',
  parameters: { layout: 'centered' },
};

export const SDKCommunitySideMenu = ({ ...args }) => <CommunitySideMenu {...args} />;

SDKCommunitySideMenu.args = {
  newsFeedActive: false,
  exploreActive: false,
  showCreateCommunityButton: true,
  searchInputPlaceholder: 'Search',
  shouldHideExplore: false,
};

SDKCommunitySideMenu.argTypes = {
  onClickCreateCommunity: { action: 'Create community clicked' },
  onClickCommunity: { action: 'Community clicked' },
  onClickNewsFeed: { action: 'NewsFeed clicked' },
  onClickExplore: { action: 'Explore clicked' },
  onSearchResultCommunityClick: { action: 'Clicked community search result' },
};
