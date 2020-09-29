import React from 'react';

import SideMenuItem from '~/core/components/SideMenuItem';
import CommunityItem from '~/social/components/CommunityItem';
import { customizableComponent } from '~/core/hocs/customization';
import { getMyCommunities } from '~/mock';

import {
  SideMenuListContainer,
  BlockTitle,
  CommunityBlock,
  MyCommunityBlock,
  NewsIcon,
  SearchIcon,
  PlusIcon,
} from './styles';
import CommunitySearch from '../ExploreHome/CommunitySearch';

export const SELECTION_TYPES = {
  NEWS_FEED: 'NEWS_FEED',
  EXPLORE: 'EXPLORE',
  COMMUNITY: 'COMMUNITY',
};

const searchContainerClassName = 'feed-menu-search-container';

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
        <CommunitySearch
          placeholder="Search"
          onSearchResultCommunityClick={community => onCommunityClick(community.communityId)}
          className={searchContainerClassName}
        />
      </CommunityBlock>
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
