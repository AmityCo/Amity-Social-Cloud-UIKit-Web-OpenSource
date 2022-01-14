import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import { Newspaper, Search } from '~/icons';
import { PageTypes } from '~/social/constants';
import SideMenuSection from '~/core/components/SideMenuSection';
import { useNavigation } from '~/social/providers/NavigationProvider';
import SideMenuActionItem from '~/core/components/SideMenuActionItem';

export const NewsIcon = styled(Newspaper)`
  font-size: 20px;
`;

export const SearchIcon = styled(Search)`
  font-size: 20px;
`;

const SideSectionCommunity = ({ shouldHideExplore, children }) => {
  const { onChangePage, page } = useNavigation();

  return (
    <SideMenuSection heading={<FormattedMessage id="sidesectioncommunity.community" />}>
      <SideMenuActionItem
        icon={<NewsIcon />}
        active={page.type === PageTypes.NewsFeed}
        onClick={() => onChangePage(PageTypes.NewsFeed)}
      >
        <FormattedMessage id="sidesectioncommunity.newfeed" />
      </SideMenuActionItem>

      {!shouldHideExplore && (
        <SideMenuActionItem
          icon={<SearchIcon />}
          active={page.type === PageTypes.Explore}
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
