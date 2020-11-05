import React from 'react';
import PropTypes from 'prop-types';
import { EkoPostTargetType } from 'eko-sdk';

import FeedLayout from '~/social/layouts/Feed';
import Feed from '~/social/components/Feed';

import TrendingList from '~/social/components/community/TrendingList';
import RecommendedList from '~/social/components/community/RecommendedList';

const NewsFeed = ({ onClickUser, onClickCommunity, blockRouteChange }) => {
  const Side = (
    <>
      <TrendingList onClickCommunity={onClickCommunity} />
      <RecommendedList onClickCommunity={onClickCommunity} />
    </>
  );

  return (
    <FeedLayout aside={Side}>
      <Feed
        targetType={EkoPostTargetType.GlobalFeed}
        onClickUser={onClickUser}
        blockRouteChange={blockRouteChange}
        showPostCreator
      />
    </FeedLayout>
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
