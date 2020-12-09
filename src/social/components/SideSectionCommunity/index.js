import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SideMenuActionItem from '~/core/components/SideMenuActionItem';
import SideMenuSection from '~/core/components/SideMenuSection';
import { Newspaper, Search } from '~/icons';

export const NewsIcon = styled(Newspaper)`
  font-size: 20px;
`;

export const SearchIcon = styled(Search)`
  font-size: 20px;
`;

const SideSectionCommunity = ({
  onClickNewsFeed,
  onClickExplore,
  newsFeedActive,
  exploreActive,
  shouldHideExplore,
  children,
}) => (
  <SideMenuSection heading="Community">
    <SideMenuActionItem icon={<NewsIcon />} onClick={onClickNewsFeed} active={newsFeedActive}>
      NewsFeed
    </SideMenuActionItem>
    {!shouldHideExplore && (
      <SideMenuActionItem icon={<SearchIcon />} onClick={onClickExplore} active={exploreActive}>
        Explore
      </SideMenuActionItem>
    )}
    {children}
  </SideMenuSection>
);

SideSectionCommunity.propTypes = {
  onClickNewsFeed: PropTypes.func,
  onClickExplore: PropTypes.func,
  newsFeedActive: PropTypes.bool,
  exploreActive: PropTypes.bool,
  shouldHideExplore: PropTypes.bool,
  children: PropTypes.node,
};

export default SideSectionCommunity;
