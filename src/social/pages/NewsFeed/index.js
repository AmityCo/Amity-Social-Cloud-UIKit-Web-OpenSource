import React from 'react';
import { PostTargetType } from '@amityco/js-sdk';

import { PageTypes } from '~/social/constants';
import PageLayout from '~/social/layouts/Page';
import Feed from '~/social/components/Feed';

import TrendingList from '~/social/components/community/TrendingList';
import RecommendedList from '~/social/components/community/RecommendedList';
import { useNavigation } from '~/social/providers/NavigationProvider';

const NewsFeed = () => {
  const { onChangePage } = useNavigation();

  const Side = (
    <>
      <TrendingList slim />
      <RecommendedList slim />
    </>
  );

  return (
    <PageLayout aside={Side}>
      <Feed
        targetType={PostTargetType.GlobalFeed}
        goToExplore={() => onChangePage(PageTypes.Explore)}
        showPostCreator
      />
    </PageLayout>
  );
};

export default NewsFeed;
