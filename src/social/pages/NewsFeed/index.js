import React from 'react';
import PropTypes from 'prop-types';
import { EkoPostTargetType } from 'eko-sdk';

import PageLayout from '~/social/layouts/Page';
import Feed from '~/social/components/Feed';

import TrendingList from '~/social/components/community/TrendingList';
import RecommendedList from '~/social/components/community/RecommendedList';

const NewsFeed = ({ blockRouteChange }) => {
  const Side = (
    <>
      <TrendingList slim />
      <RecommendedList slim />
    </>
  );

  return (
    <PageLayout aside={Side}>
      <Feed
        targetType={EkoPostTargetType.GlobalFeed}
        blockRouteChange={blockRouteChange}
        showPostCreator
      />
    </PageLayout>
  );
};

NewsFeed.defaultProps = {
  blockRouteChange: () => {},
};

NewsFeed.propTypes = {
  blockRouteChange: PropTypes.func,
};

export default NewsFeed;
