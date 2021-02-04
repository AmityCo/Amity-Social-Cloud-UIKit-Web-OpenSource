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
  className,

  onClickNewsFeed,
  newsFeedActive,

  onClickExplore,
  exploreActive,

  activeCommunity,
}) => (
  <SideMenu className={className}>
    <CommunitySearch sticky />

    <SideSectionCommunity
      newsFeedActive={newsFeedActive}
      onClickNewsFeed={onClickNewsFeed}
      exploreActive={exploreActive}
      onClickExplore={onClickExplore}
    />

    <SideSectionMyCommunity activeCommunity={activeCommunity} showCreateButton />
  </SideMenu>
);

CommunitySideMenu.propTypes = {
  className: PropTypes.string,

  onClickNewsFeed: PropTypes.func,
  newsFeedActive: PropTypes.bool,

  onClickExplore: PropTypes.func,
  exploreActive: PropTypes.bool,

  activeCommunity: PropTypes.string,
};

CommunitySideMenu.defaultProps = {
  onClickNewsFeed: () => {},
  onClickExplore: () => {},
};

export default CommunitySideMenu;
