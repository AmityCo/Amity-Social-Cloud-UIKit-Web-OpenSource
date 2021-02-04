import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SideMenuActionItem from '~/core/components/SideMenuActionItem';
import SideMenuSection from '~/core/components/SideMenuSection';
import { Newspaper, Search } from '~/icons';
import { PageTypes } from '~/social/constants';
import { useNavigation } from '~/social/providers/NavigationProvider';

export const NewsIcon = styled(Newspaper)`
  font-size: 20px;
`;

export const SearchIcon = styled(Search)`
  font-size: 20px;
`;

const SideSectionCommunity = ({ shouldHideExplore, children }) => {
  const { onChangePage, page } = useNavigation();

  return (
    <SideMenuSection heading="Community">
      <SideMenuActionItem
        icon={<NewsIcon />}
        onClick={() => onChangePage(PageTypes.NewsFeed)}
        active={page.type === PageTypes.NewsFeed}
      >
        NewsFeed
      </SideMenuActionItem>

      {!shouldHideExplore && (
        <SideMenuActionItem
          icon={<SearchIcon />}
          onClick={() => onChangePage(PageTypes.Explore)}
          active={page.type === PageTypes.Explore}
        >
          Explore
        </SideMenuActionItem>
      )}
      {children}
    </SideMenuSection>
  );
};

SideSectionCommunity.propTypes = {
  shouldHideExplore: PropTypes.bool,
  children: PropTypes.node,
};

export default SideSectionCommunity;
