import React from 'react';

import { CommunityFilter } from '@amityco/js-sdk';
import { FormattedMessage } from 'react-intl';
import RecommendedList from '~/social/components/community/RecommendedList';
import TrendingList from '~/social/components/community/TrendingList';
// import CategoriesCard from '~/social/components/category/CategoriesCard';
import CommunitiesList from '~/social/components/CommunitiesList';
import Title from '~/social/components/community/Title';

import { PageContainer } from './styles';

const fullListQueryParam = { filter: CommunityFilter.All };

const ExplorePage = () => {
  return (
    <PageContainer>
      <RecommendedList />
      {/* <TrendingList /> */}
      <Title>
        <FormattedMessage id="todaysTrendingTitle" />
      </Title>
      <CommunitiesList
        // className={className}
        communitiesQueryParam={fullListQueryParam}
        // activeCommunity={activeCommunity}
        showDescription
      />

      {/* <CategoriesCard /> */}
    </PageContainer>
  );
};

export default ExplorePage;
