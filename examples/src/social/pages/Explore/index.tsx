import React from 'react';

import RecommendedList from '~/social/components/community/RecommendedList';
import TrendingList from '~/social/components/community/TrendingList';
import CategoriesCard from '~/social/components/category/CategoriesCard';

import { PageContainer } from './styles';
import {
  CommunitySideMenuOverlay,
  HeadTitle,
  MobileContainer,
  StyledCommunitySideMenu,
  StyledBarsIcon,
} from '../NewsFeed/styles';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

const StyledMobileContainer = styled(MobileContainer)`
  background-color: #f7f7f8;
`;

export const Wrapper = styled.div`
  height: 100%;
  margin: 0 auto;
  padding: 28px 0;
  overflow-y: auto;
`;

interface ExplorePageProps {
  isOpen: boolean;
  toggleOpen: () => void;
  hideSideMenu?: boolean;
}

const ExplorePage = ({ isOpen, toggleOpen, hideSideMenu }: ExplorePageProps) => {
  const { formatMessage } = useIntl();

  return (
    <Wrapper>
      {hideSideMenu !== true && (
        <>
          <CommunitySideMenuOverlay isOpen={isOpen} onClick={toggleOpen} />
          <StyledCommunitySideMenu isOpen={isOpen} />
          <StyledMobileContainer>
            <StyledBarsIcon onClick={toggleOpen} />
            <HeadTitle>{formatMessage({ id: 'sidebar.explore' })}</HeadTitle>
          </StyledMobileContainer>
        </>
      )}
      <PageContainer>
        <RecommendedList />
        <TrendingList />
        <CategoriesCard />
      </PageContainer>
    </Wrapper>
  );
};

export default ExplorePage;
