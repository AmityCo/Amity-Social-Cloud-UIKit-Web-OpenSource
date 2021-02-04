import React from 'react';
import styled from 'styled-components';

import ExploreHeader from '~/social/components/ExploreHeader';
import RecommendedList from '~/social/components/community/RecommendedList';
import TrendingList from '~/social/components/community/TrendingList';
import CategoriesCard from '~/social/components/category/CategoriesCard';

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 1.5rem;
`;

const ExplorePage = () => (
  <PageContainer>
    <ExploreHeader />
    <RecommendedList />
    <TrendingList />
    <CategoriesCard />
  </PageContainer>
);

export default ExplorePage;
