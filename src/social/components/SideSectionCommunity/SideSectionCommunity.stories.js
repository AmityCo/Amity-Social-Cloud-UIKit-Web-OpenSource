import React from 'react';

import SideSectionCommunityComponent from '.';

export default {
  title: 'Components/Community/SideMenu/CommunitySection',
  parameters: { layout: 'centered' },
};

export const SideSectionCommunity = ({
  onClickNewsFeed,
  onClickExplore,
  newsFeedActive,
  exploreActive,
  children,
}) => (
  <SideSectionCommunityComponent
    onClickNewsFeed={onClickNewsFeed}
    onClickExplore={onClickExplore}
    newsFeedActive={newsFeedActive}
    exploreActive={exploreActive}
  >
    {children}
  </SideSectionCommunityComponent>
);

SideSectionCommunity.args = {
  newsFeedActive: false,
  exploreActive: false,
  children: 'children slot',
};

SideSectionCommunity.argTypes = {
  newsFeedActive: { control: { type: 'boolean' } },
  exploreActive: { control: { type: 'boolean' } },
  onClickNewsFeed: { action: 'NewsFeed clicked' },
  onClickExplore: { action: 'Explore clicked' },
};
