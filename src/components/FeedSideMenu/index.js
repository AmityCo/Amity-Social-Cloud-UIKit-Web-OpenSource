import React from 'react';

import { customizableComponent } from 'hocs/customization';
import { getMyCommunities } from 'mock';
import CommunityItem from 'components/CommunityItem';
import SideMenuItem from 'components/SideMenuItem';

import {
  SideMenuListContainer,
  BlockTitle,
  CommunityBlock,
  MyCommunityBlock,
  NewsIcon,
  SearchIcon,
  PlusIcon,
} from './styles';

export const SELECTION_TYPES = {
  NEWS_FEED: 'NEWS_FEED',
  EXPLORE: 'EXPLORE',
  COMMUNITY: 'COMMUNITY',
};

const FeedSideMenu = ({
  selected: { type, communityId } = {},
  onCreateCommunityClick,
  onCommunityClick,
  onNewsFeedClick,
  onExploreClick,
}) => {
  const myCommunities = getMyCommunities();

  return (
    <SideMenuListContainer>
      <CommunityBlock>
        <BlockTitle>Community</BlockTitle>
        <SideMenuItem
          onClick={onNewsFeedClick}
          active={type === SELECTION_TYPES.NEWS_FEED}
          icon={<NewsIcon />}
        >
          NewsFeed
        </SideMenuItem>
        <SideMenuItem
          onClick={onExploreClick}
          active={type === SELECTION_TYPES.EXPLORE}
          icon={<SearchIcon />}
        >
          Explore
        </SideMenuItem>
      </CommunityBlock>
      <MyCommunityBlock>
        <BlockTitle>My Community</BlockTitle>
        <SideMenuItem onClick={onCreateCommunityClick} icon={<PlusIcon />}>
          Create Community
        </SideMenuItem>
        {myCommunities.map(community => (
          <CommunityItem
            key={community.communityId}
            active={communityId === community.communityId}
            onClick={() => onCommunityClick(community.communityId)}
            community={community}
          />
        ))}
      </MyCommunityBlock>
    </SideMenuListContainer>
  );
};

export default customizableComponent('FeedSideMenu', FeedSideMenu);
