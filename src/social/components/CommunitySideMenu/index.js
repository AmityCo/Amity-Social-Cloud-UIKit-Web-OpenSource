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
  newsFeedActive,

  onClickExplore,
  exploreActive,

  onClickCommunity,
  onCommunityCreated,
  activeCommunity,
}) => (
  <SideMenu>
    <CommunitySearch onClickCommunity={onClickCommunity} sticky />

    <SideSectionCommunity
      newsFeedActive={newsFeedActive}
      onClickNewsFeed={onClickNewsFeed}
      exploreActive={exploreActive}
      onClickExplore={onClickExplore}
    />

    <SideSectionMyCommunity
      onClickCreate={onCommunityCreated}
      onClickCommunity={onClickCommunity}
      activeCommunity={activeCommunity}
      showCreateButton
    />
  </SideMenu>
);

CommunitySideMenu.propTypes = {
  onClickNewsFeed: PropTypes.func,
  newsFeedActive: PropTypes.bool,

  onClickExplore: PropTypes.func,
  exploreActive: PropTypes.bool,

  activeCommunity: PropTypes.string,

  onClickCommunity: PropTypes.func,
  onCommunityCreated: PropTypes.func,
};

CommunitySideMenu.defaultProps = {
  onClickNewsFeed: () => {},
  onClickExplore: () => {},
  onClickCommunity: () => {},
  onCommunityCreated: () => {},
};

export default CommunitySideMenu;
