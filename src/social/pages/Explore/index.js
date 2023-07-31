import React from 'react';
// import CategoriesCard from '~/social/components/category/CategoriesCard';
import RecommendedList from '~/social/components/community/RecommendedList';
// import TrendingList from '~/social/components/community/TrendingList';

import MyCommunitiesMobile from '~/social/components/MyCommunitiesMobile';
import FeaturedVideos from '~/social/components/FeaturedVideos';
import WellnessWorkshops from '~/social/components/WellnessWorkshops';
import { PageContainer } from './styles';

const ExplorePage = () => (
  <PageContainer>
    <MyCommunitiesMobile />
    <RecommendedList />
    <FeaturedVideos />
    <WellnessWorkshops />

    {/* <TrendingList /> */}

    {/* <CategoriesCard /> hidden for the time being */}
  </PageContainer>
);

export default ExplorePage;
