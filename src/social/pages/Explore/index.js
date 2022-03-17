import React from 'react';

import RecommendedList from '~/social/components/community/RecommendedList';
import TrendingList from '~/social/components/community/TrendingList';
import CategoriesCard from '~/social/components/category/CategoriesCard';

import { PageContainer } from './styles';

const ExplorePage = () => (
  <PageContainer>
    <RecommendedList />
    <TrendingList />
    <CategoriesCard />
  </PageContainer>
);

export default ExplorePage;
