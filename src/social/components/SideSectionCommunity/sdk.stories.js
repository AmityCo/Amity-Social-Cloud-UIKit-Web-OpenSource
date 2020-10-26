import React from 'react';

import UiKitSideSectionCommunityComponent from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKSideSectionCommunity = ({
  onClickNewsFeed,
  onClickExplore,
  newsFeedActive,
  exploreActive,
  children,
}) => (
  <UiKitSideSectionCommunityComponent
    onClickNewsFeed={onClickNewsFeed}
    onClickExplore={onClickExplore}
    newsFeedActive={newsFeedActive}
    exploreActive={exploreActive}
  >
    {children}
  </UiKitSideSectionCommunityComponent>
);

SDKSideSectionCommunity.storyName = 'Community side section';

SDKSideSectionCommunity.args = {
  newsFeedActive: false,
  exploreActive: false,
  children: 'children slot',
};

SDKSideSectionCommunity.argTypes = {
  newsFeedActive: { control: { type: 'boolean' } },
  exploreActive: { control: { type: 'boolean' } },
  onClickNewsFeed: { action: 'onClickNewsFeed()' },
  onClickExplore: { action: 'onClickExplore()' },
};
