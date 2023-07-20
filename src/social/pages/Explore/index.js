import React from 'react';
import CategoriesCard from '~/social/components/category/CategoriesCard';
import RecommendedList from '~/social/components/community/RecommendedList';
import TrendingList from '~/social/components/community/TrendingList';

import MyCommunitiesMobile from '~/social/components/MyCommunitiesMobile';
import { PageContainer } from './styles';

const ExplorePage = () => (
  <PageContainer>
    <MyCommunitiesMobile />

    <RecommendedList />
    <TrendingList />
    <CategoriesCard />
  </PageContainer>
);

export default ExplorePage;
