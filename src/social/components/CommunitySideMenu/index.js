import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SideMenu from '~/core/components/SideMenu';
import SideSectionCommunity from '~/social/components/SideSectionCommunity';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import UiKitCommunitySearch from '~/social/components/CommunitySearch';

const CommunitySearch = styled(UiKitCommunitySearch)`
  background: ${({ theme }) => theme.palette.system.background};
  padding: 0.5rem;
`;

const CommunitySideMenu = ({
  onClickNewsFeed,
  onClickExplore,
  newsFeedActive,
  exploreActive,
  onClickCreateCommunity,
  showCreateCommunityButton,
  onClickCommunity,
  getIsCommunityActive,
  myCommunitySectionClassName,
  onSearchResultCommunityClick,
  searchInputPlaceholder,
  searchInputClassName,
  shouldHideExplore,
}) => (
  <SideMenu>
    <CommunitySearch
      onSearchResultCommunityClick={onSearchResultCommunityClick}
      className={searchInputClassName}
      placeholder={searchInputPlaceholder}
      sticky
    />
    <SideSectionCommunity
      onClickNewsFeed={onClickNewsFeed}
      onClickExplore={onClickExplore}
      newsFeedActive={newsFeedActive}
      exploreActive={exploreActive}
      shouldHideExplore={shouldHideExplore}
    />
    <SideSectionMyCommunity
      onClickCreate={onClickCreateCommunity}
      showCreateButton={showCreateCommunityButton}
      onClickCommunity={onClickCommunity}
      getIsCommunityActive={getIsCommunityActive}
      className={myCommunitySectionClassName}
    />
  </SideMenu>
);

CommunitySideMenu.propTypes = {
  onClickNewsFeed: PropTypes.func,
  onClickExplore: PropTypes.func,
  newsFeedActive: PropTypes.bool,
  exploreActive: PropTypes.bool,
  onClickCreateCommunity: PropTypes.func,
  showCreateCommunityButton: PropTypes.bool,
  onClickCommunity: PropTypes.func,
  getIsCommunityActive: PropTypes.func,
  myCommunitySectionClassName: PropTypes.string,
  onSearchResultCommunityClick: PropTypes.func,
  searchInputPlaceholder: PropTypes.string,
  searchInputClassName: PropTypes.string,
  shouldHideExplore: PropTypes.bool,
};

export default CommunitySideMenu;
