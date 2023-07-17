import { CommunityFilter, FeedType, PostTargetType } from '@amityco/js-sdk';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import DefaultPostRenderer from '~/social/components/post/Post/DefaultPostRenderer';
import { PageTypes } from '~/social/constants';

import ConditionalRender from '~/core/components/ConditionalRender';
import customizableComponent from '~/core/hocs/customization';
import EmptyFeed from '~/social/components/EmptyFeed';
import LoadMore from '~/social/components/LoadMore';
import PrivateFeed from '~/social/components/PrivateFeed';
import PostCreator from '~/social/components/post/Creator';
import Post from '~/social/components/post/Post';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import useFeed from '~/social/hooks/useFeed';
import { FeedScrollContainer } from './styles';
// import TrendingList from '../community/TrendingList';
import NewsFeedTrendingList from '../community/NewsFeedTrendingList';

import { useNavigation } from '~/social/providers/NavigationProvider';

const queryParams = { filter: CommunityFilter.Member };

const Feed = ({
  className = null,
  feedType,
  targetType = PostTargetType.MyFeed,
  targetId = '',
  showPostCreator = false,
  onPostCreated,
  goToExplore,
  readonly = false,
  isHiddenProfile = false,
}) => {
  const { page } = useNavigation();
  const enablePostTargetPicker = targetType === PostTargetType.GlobalFeed;

  const [posts, hasMore, loadMore, loading, loadingMore] = useFeed({
    targetType,
    targetId,
    feedType,
  });
  const [communities, hasMoreCommunities, loadMoreCommunities] = useCommunitiesList(
    queryParams,
    false,
    () => !showPostCreator && !enablePostTargetPicker,
  );

  function renderLoadingSkeleton() {
    return new Array(3).fill(3).map((x, index) => <DefaultPostRenderer key={index} loading />);
  }

  return (
    <FeedScrollContainer
      className={className}
      dataLength={posts.length}
      next={loadMore}
      hasMore={hasMore}
    >
      <ConditionalRender condition={!isHiddenProfile}>
        <>
          {showPostCreator && (
            <PostCreator
              data-qa-anchor="feed-post-creator-textarea"
              targetType={targetType}
              targetId={targetId}
              communities={communities}
              enablePostTargetPicker={enablePostTargetPicker}
              hasMoreCommunities={hasMoreCommunities}
              loadMoreCommunities={loadMoreCommunities}
              onCreateSuccess={onPostCreated}
            />
          )}

          {loading && renderLoadingSkeleton()}

          {!loading && posts.length > 0 && (
            <LoadMore hasMore={hasMore} loadMore={loadMore} className="load-more no-border">
              {posts.map(({ postId }, index) => (
                <React.Fragment key={postId}>
                  <Post
                    postId={postId}
                    hidePostTarget={targetType !== PostTargetType.GlobalFeed}
                    readonly={readonly}
                  />
                  {page.type === PageTypes.NewsFeed && index === 0 && <NewsFeedTrendingList />}
                </React.Fragment>
              ))}

              {loadingMore && renderLoadingSkeleton()}
            </LoadMore>
          )}

          {!loading && posts.length === 0 && (
            <EmptyFeed
              targetType={targetType}
              goToExplore={goToExplore}
              canPost={showPostCreator}
              feedType={feedType}
            />
          )}
        </>
        <PrivateFeed />
      </ConditionalRender>
    </FeedScrollContainer>
  );
};

Feed.propTypes = {
  className: PropTypes.string,
  feedType: PropTypes.oneOf(Object.values(FeedType)),
  targetType: PropTypes.oneOf(Object.values(PostTargetType)),
  targetId: PropTypes.string,
  showPostCreator: PropTypes.bool,
  // below is to be refactored
  goToExplore: PropTypes.func,
  readonly: PropTypes.bool,
  isHiddenProfile: PropTypes.bool,
  onPostCreated: PropTypes.func,
};

export default memo(customizableComponent('Feed', Feed));
