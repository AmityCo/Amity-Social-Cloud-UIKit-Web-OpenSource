import React from 'react';
import PropTypes from 'prop-types';
import { EkoPostTargetType } from 'eko-sdk';

import PageLayout from '~/social/layouts/Page';
import Feed from '~/social/components/Feed';

import TrendingList from '~/social/components/community/TrendingList';
import RecommendedList from '~/social/components/community/RecommendedList';

const NewsFeed = ({ onClickUser, onClickCommunity, blockRouteChange }) => {
  const Side = (
    <>
      <TrendingList onClickCommunity={onClickCommunity} slim />
      <RecommendedList onClickCommunity={onClickCommunity} slim />
    </>
  );

  return (
    <PageLayout aside={Side}>
      <Feed
        targetType={EkoPostTargetType.GlobalFeed}
        onClickCommunity={onClickCommunity}
        onClickUser={onClickUser}
        blockRouteChange={blockRouteChange}
        showPostCreator
      />
    </PageLayout>
  );
};

NewsFeed.defaultProps = {
  onClickUser: () => {},
  onClickCommunity: () => {},
  blockRouteChange: () => {},
};

NewsFeed.propTypes = {
  onClickUser: PropTypes.func,
  onClickCommunity: PropTypes.func,
  blockRouteChange: PropTypes.func,
};

export default NewsFeed;
