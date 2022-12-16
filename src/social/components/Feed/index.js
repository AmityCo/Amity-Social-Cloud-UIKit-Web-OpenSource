import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PostTargetType, FeedType, CommunityFilter } from '@amityco/js-sdk';

import { ImpressionTracker } from '~/core/components/ImpressionTracker';
import DefaultPostRenderer from '~/social/components/post/Post/DefaultPostRenderer';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import PostCreator from '~/social/components/post/Creator';
import Post from '~/social/components/post/Post';
import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
import EmptyFeed from '~/social/components/EmptyFeed';
import LoadMore from '~/social/components/LoadMore';
import useFeed from '~/social/hooks/useFeed';
import { FeedScrollContainer } from './styles';
import PrivateFeed from '~/social/components/PrivateFeed';

const queryParams = { filter: CommunityFilter.Member };

const FEED_FETCH_POST_LIMIT = 10;
const CAN_POST_ON_GLOBAL_TIMELINE = false;

/** If posting on global feed is disabled, select the first community and set community feed as a target type  */
function getAdjustedPostTarget(
  targetType,
  targetId,
  communities = [],
  canPostOnGlobalFeed = false,
) {
  if (targetType === PostTargetType.GlobalFeed && !canPostOnGlobalFeed) {
    return { targetType: PostTargetType.CommunityFeed, targetId: communities?.[0]?.communityId };
  }

  return { targetType, targetId };
}

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
  handleCopyPostPath,
  handleCopyCommentPath,
}) => {
  const enablePostTargetPicker = targetType === PostTargetType.GlobalFeed;

  const [communities, hasMoreCommunities, loadMoreCommunities] = useCommunitiesList(
    queryParams,
    false,
    () => !showPostCreator && !enablePostTargetPicker,
  );

  const [posts, hasMore, loadMore, loading, loadingMore] = useFeed({
    targetType,
    targetId,
    feedType,
    limit: FEED_FETCH_POST_LIMIT,
  });

  const { targetId: postCreatorTargetId, targetType: postCreatorTargetType } =
    getAdjustedPostTarget(targetType, targetId, communities, CAN_POST_ON_GLOBAL_TIMELINE);

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
          {showPostCreator && postCreatorTargetId && (
            <PostCreator
              data-qa-anchor="feed-post-creator-textarea"
              targetType={postCreatorTargetType}
              targetId={postCreatorTargetId}
              communities={communities}
              canTargetUser={CAN_POST_ON_GLOBAL_TIMELINE}
              enablePostTargetPicker={enablePostTargetPicker}
              hasMoreCommunities={hasMoreCommunities}
              loadMoreCommunities={loadMoreCommunities}
              onCreateSuccess={onPostCreated}
            />
          )}

          {loading && renderLoadingSkeleton()}

          {!loading && posts.length > 0 && (
            <LoadMore hasMore={hasMore} loadMore={loadMore} className="load-more no-border">
              {posts.map(({ postId }) => (
                <ImpressionTracker
                  key={postId}
                  postId={postId}
                  visibleThreshold={0}
                  className="post-wrapper"
                >
                  <Post
                    key={postId}
                    postId={postId}
                    hidePostTarget={targetType !== PostTargetType.GlobalFeed}
                    readonly={readonly}
                    handleCopyPostPath={handleCopyPostPath}
                    handleCopyCommentPath={handleCopyCommentPath}
                  />
                </ImpressionTracker>
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
  handleCopyPostPath: PropTypes.func,
  handleCopyCommentPath: PropTypes.func,
};

export default memo(customizableComponent('Feed', Feed));
