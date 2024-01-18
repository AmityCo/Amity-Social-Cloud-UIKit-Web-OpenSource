import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import { Newspaper, Search } from '~/icons';
import { PageTypes } from '~/social/constants';
import SideMenuSection from '~/core/components/SideMenuSection';
import { useNavigation } from '~/social/providers/NavigationProvider';
import SideMenuActionItem from '~/core/components/SideMenuActionItem';

export const NewsIcon = styled(Newspaper)<{ icon?: ReactNode }>`
  font-size: 20px;
`;

export const SearchIcon = styled(Search)<{ icon?: ReactNode }>`
  font-size: 20px;
`;

interface SideSectionCommunityProps {
  shouldHideExplore?: boolean;
  children?: ReactNode;
}

const SideSectionCommunity = ({ shouldHideExplore, children }: SideSectionCommunityProps) => {
  const { onChangePage, page } = useNavigation();

  return (
    <SideMenuSection heading={<FormattedMessage id="sidesectioncommunity.community" />}>
      <SideMenuActionItem
        data-qa-anchor="side-section-community-side-menu-action-item-news-feed-button"
        icon={<NewsIcon />}
        active={page.type === PageTypes.NewsFeed}
        onClick={() => onChangePage(PageTypes.NewsFeed)}
      >
        <FormattedMessage id="sidesectioncommunity.newfeed" />
      </SideMenuActionItem>

      {!shouldHideExplore && (
        <SideMenuActionItem
          data-qa-anchor="side-section-community-side-menu-action-item-explore-button"
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

export default SideSectionCommunity;
