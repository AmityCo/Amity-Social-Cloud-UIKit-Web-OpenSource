import React, { memo, useCallback } from 'react';
import DefaultPostRenderer from '~/social/components/post/Post/DefaultPostRenderer';

import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import PostCreator from '~/social/components/post/Creator';
import Post from '~/social/components/post/Post';

import EmptyFeed from '~/social/components/EmptyFeed';
import { FeedScrollContainer } from './styles';
import PrivateFeed from '~/social/components/PrivateFeed';
import useFeed from '~/social/hooks/useFeed';
import LoadMoreWrapper from '../LoadMoreWrapper';
import useSDK from '~/core/hooks/useSDK';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useCommunitySubscription from '~/social/hooks/useCommunitySubscription';
import { SubscriptionLevels } from '@amityco/ts-sdk';
import usePostsCollection from '~/social/hooks/collections/usePostsCollection';
import useCommunitiesCollection from '~/social/hooks/collections/useCommunitiesCollection';

interface GlobalFeedProps {
  className?: string;
  feedType?: 'reviewing' | 'published';
  showPostCreator?: boolean;
  goToExplore?: () => void;
  readonly?: boolean;
  isHiddenProfile?: boolean;
}

const GlobalFeed = ({
  className = '',
  feedType,
  showPostCreator = false,
  goToExplore,
  readonly = false,
  isHiddenProfile = false,
}: GlobalFeedProps) => {
  const { currentUserId } = useSDK();
  const { contents, isLoading, loadMore, prependItem, removeItem, hasMore, loadMoreHasBeenCalled } =
    useFeed();

  function renderLoadingSkeleton() {
    return new Array(3).fill(3).map((_, index) => <DefaultPostRenderer key={index} loading />);
  }

  return (
    <>
      {showPostCreator ? (
        <PostCreator
          data-qa-anchor="feed-post-creator-textarea"
          targetType={'user'}
          targetId={currentUserId || undefined}
          enablePostTargetPicker={false}
          onCreateSuccess={(newPost) => prependItem(newPost)}
        />
      ) : null}
      <FeedScrollContainer
        className={className}
        dataLength={contents.length}
        next={loadMore}
        hasMore={hasMore}
        loader={null}
      >
        {!isHiddenProfile ? (
          <>
            {isLoading && !loadMoreHasBeenCalled ? renderLoadingSkeleton() : null}

            {(!isLoading || loadMoreHasBeenCalled) && contents.length > 0 && (
              <LoadMoreWrapper
                hasMore={hasMore}
                loadMore={loadMore}
                className="load-more no-border"
                contentSlot={contents.map((content) => (
                  <Post
                    key={content.postId}
                    postId={content.postId}
                    hidePostTarget={false}
                    readonly={readonly}
                    onDeleted={(postId) => removeItem(postId)}
                  />
                ))}
              />
            )}

            {!isLoading && contents.length === 0 && (
              <EmptyFeed
                targetType={'global'}
                goToExplore={goToExplore}
                canPost={showPostCreator}
                feedType={feedType}
              />
            )}

            {isLoading && loadMoreHasBeenCalled ? renderLoadingSkeleton() : null}
          </>
        ) : (
          <PrivateFeed />
        )}
      </FeedScrollContainer>
    </>
  );
};

interface MyFeedProps {
  className?: string;
  feedType?: 'reviewing' | 'published';
  targetType?: string;
  targetId?: string | null;
  showPostCreator?: boolean;
  onPostCreated?: () => void;
  onPostDeleted?: (postId: string) => void;
  goToExplore?: () => void;
  readonly?: boolean;
  isHiddenProfile?: boolean;
}

const MyFeed = ({
  className = '',
  feedType,
  targetType = 'myFeed',
  onPostCreated,
  goToExplore,
  readonly = false,
  isHiddenProfile = false,
}: MyFeedProps) => {
  const { currentUserId } = useSDK();

  const targetId = currentUserId || undefined;

  const { posts, hasMore, loadMore, isLoading, loadMoreHasBeenCalled } = usePostsCollection({
    targetType: 'user',
    targetId,
    feedType,
  });

  const {
    communities,
    hasMore: hasMoreCommunities,
    loadMore: loadMoreCommunities,
  } = useCommunitiesCollection({
    membership: 'member',
  });

  const loadMoreCommunitiesCB = useCallback(() => {
    loadMoreCommunities?.();
  }, [loadMoreCommunities]);

  function renderLoadingSkeleton() {
    return new Array(3).fill(3).map((x, index) => <DefaultPostRenderer key={index} loading />);
  }

  return (
    <>
      <PostCreator
        data-qa-anchor="feed-post-creator-textarea"
        targetType={'user'}
        targetId={targetId || undefined}
        communities={communities}
        enablePostTargetPicker={false}
        hasMoreCommunities={hasMoreCommunities}
        loadMoreCommunities={loadMoreCommunitiesCB}
        onCreateSuccess={onPostCreated}
      />
      <FeedScrollContainer
        className={className}
        dataLength={posts.length}
        next={loadMore}
        hasMore={hasMore}
        loader={null}
      >
        {!isHiddenProfile ? (
          <>
            {isLoading && !loadMoreHasBeenCalled ? renderLoadingSkeleton() : null}

            {(!isLoading || loadMoreHasBeenCalled) && posts.length > 0 && (
              <LoadMoreWrapper
                hasMore={hasMore}
                loadMore={loadMore}
                className="load-more no-border"
                contentSlot={
                  <>
                    {posts.map((post) => (
                      <Post
                        key={post.postId}
                        postId={post.postId}
                        hidePostTarget={true}
                        readonly={readonly}
                      />
                    ))}
                  </>
                }
              />
            )}

            {!isLoading && posts.length === 0 && (
              <EmptyFeed
                targetType={targetType}
                goToExplore={goToExplore}
                canPost={true}
                feedType={feedType}
              />
            )}

            {isLoading && loadMoreHasBeenCalled ? renderLoadingSkeleton() : null}
          </>
        ) : (
          <PrivateFeed />
        )}
      </FeedScrollContainer>
    </>
  );
};

interface CommunityFeedProps {
  className?: string;
  targetType: string;
  targetId?: string | null;
  feedType?: 'reviewing' | 'published';
  showPostCreator?: boolean;
  onPostCreated?: () => void;
  goToExplore?: () => void;
  readonly?: boolean;
  isHiddenProfile?: boolean;
}

const CommunityFeed = ({
  className = '',
  targetType,
  targetId = '',
  feedType,
  showPostCreator = false,
  onPostCreated,
  goToExplore,
  readonly = false,
  isHiddenProfile = false,
}: CommunityFeedProps) => {
  const { posts, hasMore, loadMore, isLoading, loadMoreHasBeenCalled } = usePostsCollection({
    targetType,
    targetId: targetId || undefined,
    feedType,
  });

  useCommunitySubscription({
    communityId: targetId,
    level: SubscriptionLevels.COMMUNITY,
  });

  function renderLoadingSkeleton() {
    return new Array(3).fill(3).map((_, index) => <DefaultPostRenderer key={index} loading />);
  }

  return (
    <>
      {showPostCreator ? (
        <PostCreator
          data-qa-anchor="feed-post-creator-textarea"
          targetType={targetType}
          targetId={targetId}
          enablePostTargetPicker={false}
          onCreateSuccess={onPostCreated}
        />
      ) : null}
      <FeedScrollContainer
        className={className}
        dataLength={posts.length}
        next={loadMore}
        hasMore={hasMore}
        loader={null}
      >
        {!isHiddenProfile ? (
          <>
            {isLoading && !loadMoreHasBeenCalled ? renderLoadingSkeleton() : null}

            {!isLoading && posts.length > 0 && (
              <LoadMoreWrapper
                hasMore={hasMore}
                loadMore={loadMore}
                className="load-more no-border"
                contentSlot={
                  <>
                    {posts.map((post) => (
                      <Post
                        key={post.postId}
                        postId={post.postId}
                        hidePostTarget
                        readonly={readonly}
                      />
                    ))}
                  </>
                }
              />
            )}

            {!isLoading && posts.length === 0 && (
              <EmptyFeed
                targetType={targetType}
                goToExplore={goToExplore}
                canPost={showPostCreator}
              />
            )}

            {isLoading && loadMoreHasBeenCalled ? renderLoadingSkeleton() : null}
          </>
        ) : (
          <PrivateFeed />
        )}
      </FeedScrollContainer>
    </>
  );
};

interface BaseFeedProps {
  className?: string;
  feedType?: 'reviewing' | 'published';
  targetType: string;
  targetId?: string | null;
  showPostCreator?: boolean;
  onPostCreated?: () => void;
  goToExplore?: () => void;
  readonly?: boolean;
  isHiddenProfile?: boolean;
}

const BaseFeed = ({
  className = '',
  feedType,
  targetType,
  targetId = '',
  showPostCreator = false,
  onPostCreated,
  goToExplore,
  readonly = false,
  isHiddenProfile = false,
}: BaseFeedProps) => {
  const { posts, hasMore, loadMore, isLoading, loadMoreHasBeenCalled } = usePostsCollection({
    targetType,
    targetId: targetId || undefined,
    feedType,
  });
  const {
    communities,
    hasMore: hasMoreCommunities,
    loadMore: loadMoreCommunities,
  } = useCommunitiesCollection({
    membership: 'member',
  });

  function renderLoadingSkeleton() {
    return new Array(3).fill(3).map((_, index) => <DefaultPostRenderer key={index} loading />);
  }

  return (
    <>
      {showPostCreator && (
        <PostCreator
          data-qa-anchor="feed-post-creator-textarea"
          targetType={targetType}
          targetId={targetId}
          communities={communities}
          enablePostTargetPicker={false}
          hasMoreCommunities={hasMoreCommunities}
          loadMoreCommunities={loadMoreCommunities}
          onCreateSuccess={onPostCreated}
        />
      )}
      <FeedScrollContainer
        className={className}
        dataLength={posts.length}
        next={loadMore}
        hasMore={hasMore}
        loader={null}
      >
        {!isHiddenProfile ? (
          <>
            {isLoading && !loadMoreHasBeenCalled ? renderLoadingSkeleton() : null}

            {!isLoading && posts.length > 0 && (
              <LoadMoreWrapper
                hasMore={hasMore}
                loadMore={loadMore}
                className="load-more no-border"
                contentSlot={
                  <>
                    {posts.map((post) => (
                      <Post
                        key={post.postId}
                        postId={post.postId}
                        hidePostTarget
                        readonly={readonly}
                      />
                    ))}
                  </>
                }
              />
            )}

            {!isLoading && posts.length === 0 && (
              <EmptyFeed
                targetType={targetType}
                goToExplore={goToExplore}
                canPost={showPostCreator}
                feedType={feedType}
              />
            )}

            {isLoading && loadMoreHasBeenCalled ? renderLoadingSkeleton() : null}
          </>
        ) : (
          <PrivateFeed />
        )}
      </FeedScrollContainer>
    </>
  );
};

interface FeedProps {
  className?: string;
  feedType?: 'reviewing' | 'published';
  targetType?: string;
  targetId?: string | null;
  showPostCreator?: boolean;
  onPostCreated?: () => void;
  goToExplore?: () => void;
  readonly?: boolean;
  isHiddenProfile?: boolean;
}

const getActualTargetType = (targetType: string | undefined | null) => {
  if (targetType === 'communityFeed') return 'community';
  if (targetType === 'userFeed') return 'user';
  if (targetType === 'globalFeed') return 'feed';
  if (targetType === 'global') return 'feed';
  return targetType || 'myFeed';
};

const Feed = (props: FeedProps) => {
  const { targetType, ...rest } = props;

  const actualTargetType = getActualTargetType(targetType);

  if (actualTargetType === 'feed') {
    return <GlobalFeed {...rest} />;
  }
  if (actualTargetType === 'myFeed') {
    return <MyFeed {...rest} targetType={actualTargetType} />;
  }

  if (actualTargetType === 'community') {
    return <CommunityFeed {...rest} targetType={actualTargetType} />;
  }

  return <BaseFeed {...rest} targetType={actualTargetType} />;
};

export default memo((props: FeedProps) => {
  const CustomComponentFn = useCustomComponent<FeedProps>('Feed');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Feed {...props} />;
});
