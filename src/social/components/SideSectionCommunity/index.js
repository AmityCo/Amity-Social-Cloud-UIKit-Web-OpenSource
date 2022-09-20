import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import { Newspaper, Search } from '~/icons';
import { PageTypes } from '~/social/constants';
import SideMenuSection from '~/core/components/SideMenuSection';
import { useNavigation } from '~/social/providers/NavigationProvider';
import SideMenuActionItem from '~/core/components/SideMenuActionItem';

export const NewsIcon = styled(Newspaper).attrs({ width: 20, height: 20 })``;

export const SearchIcon = styled(Search).attrs({ width: 20, height: 20 })``;

const SideSectionCommunity = ({ shouldHideExplore, activePage, children }) => {
  const { onChangePage } = useNavigation();

  return (
    <SideMenuSection>
      <SideMenuActionItem
        icon={<NewsIcon />}
        active={activePage === PageTypes.NewsFeed}
        onClick={() => onChangePage(PageTypes.NewsFeed)}
      >
        <FormattedMessage id="sidesectioncommunity.newfeed" />
      </SideMenuActionItem>

      {!shouldHideExplore && (
        <SideMenuActionItem
          icon={<SearchIcon />}
          active={activePage === PageTypes.Explore}
          onClick={() => onChangePage(PageTypes.Explore)}
        >
          <FormattedMessage id="sidesectioncommunity.explore" />
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
