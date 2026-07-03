import { Divider } from '~/v4/social/elements/Divider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { Feed } from '~/v4/social/features/shared/components/Feed';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { EmptyNewsfeed } from '~/v4/social/components/EmptyNewsFeed';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { useGlobalFeedCollection } from '~/v4/social/hooks/collections/useGlobalFeedCollection';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import styles from './Newsfeed.module.css';

type NewsfeedProps = {
  pageId?: string;
};

export const Newsfeed = ({ pageId = '*' }: NewsfeedProps) => {
  const componentId = 'newsfeed';

  const { themeStyles } = useAmityComponent({ pageId, componentId });
  const { isDesktop } = useResponsive();

  const { newPosts, globalFeaturedPostsItems, isGlobalFeaturedPostsLoading, removeNewPost } =
    useGlobalFeedContext();

  const { posts, isLoading, isLoadingFirstPage, hasMore, loadMore, refresh } =
    useGlobalFeedCollection();

  const onFeedReachBottom = () => {
    if (hasMore && !isLoading && !isLoadingFirstPage) loadMore();
  };

  if (
    posts.length === 0 &&
    newPosts.length === 0 &&
    !isLoading &&
    !isLoadingFirstPage &&
    globalFeaturedPostsItems.length === 0 &&
    !isGlobalFeaturedPostsLoading
  ) {
    return <EmptyNewsfeed pageId={pageId} />;
  }

  return (
    <PullToRefresh className={styles.newsfeed} style={themeStyles} onTouchEndCallback={refresh}>
      <div className={styles.newsfeed__storyTab}>
        <StoryTab type="globalFeed" pageId={pageId} />
      </div>
      <Divider isShown={!isDesktop} />
      <PostComposer pageId={pageId} />
      <Feed
        pageId={pageId}
        componentId={componentId}
        posts={posts}
        newPosts={newPosts}
        isLoading={isLoading}
        isLoadingFirstPage={isLoadingFirstPage}
        hasMore={hasMore}
        globalFeaturedPosts={globalFeaturedPostsItems}
        isGlobalFeaturedPostsLoading={isGlobalFeaturedPostsLoading}
        onFeedReachBottom={onFeedReachBottom}
        onPostDeleted={(post) => {
          if (post?.postId) removeNewPost(post.postId);
        }}
      />
    </PullToRefresh>
  );
};
