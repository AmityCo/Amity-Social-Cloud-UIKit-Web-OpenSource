import { useEffect, useRef, useState } from 'react';
import { Divider } from '~/v4/social/elements/Divider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { Feed } from '~/v4/social/features/shared/components/Feed';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { EmptyNewsfeed } from '~/v4/social/components/EmptyNewsFeed';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { useGlobalFeedCollection } from '~/v4/social/hooks/collections/useGlobalFeedCollection';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import {
  getVisitorAutoJoinStatus,
  subscribeVisitorAutoJoinStatus,
  subscribeFeedRefresh,
  hasPendingFeedRefresh,
  consumeFeedRefresh,
} from '~/v4/core/stores/pendingVisitorJoin';
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

  // Track the post-sign-in auto-join lifecycle. While it is 'in-progress' the
  // newsfeed shows a loading state and does NOT render the (pre-join) feed, so
  // the just-joined community's posts appear on first paint instead of the feed
  // flashing empty -> populated -> updated as separate refetches land.
  // (Plain state + subscribe rather than useSyncExternalStore, since the UIKit
  // still supports React 17 where that hook does not exist.)
  const [autoJoinStatus, setAutoJoinStatus] = useState(getVisitorAutoJoinStatus);
  useEffect(() => {
    const sync = () => setAutoJoinStatus(getVisitorAutoJoinStatus());
    const unsubscribe = subscribeVisitorAutoJoinStatus(sync);
    // Re-sync once on mount in case the status changed between the initial
    // useState read and this subscription being attached.
    sync();
    return unsubscribe;
  }, []);
  const isAutoJoinInProgress = autoJoinStatus === 'in-progress';

  // Keep the latest refresh in a ref so the completion effect below is set up
  // once and isn't re-run by refresh's changing identity.
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  // When the auto-join settles, do a single refetch so the feed reflects the new
  // membership. The provider only flips to 'completed' after the join has had a
  // beat to propagate, so this one refetch already includes the joined
  // community's posts — no repeated blinking.
  useEffect(() => {
    if (autoJoinStatus === 'completed') refreshRef.current();
  }, [autoJoinStatus]);

  // Refresh on every feed-refresh pulse — fired when a community is auto-joined
  // while already signed-in (e.g. the Explore pinned-community auto-join), so
  // its posts appear here without a manual tab switch. Uses a monotonic signal
  // (not the skeleton status), so repeated/propagation-retry pulses each refresh.
  //
  // Home tabs are conditionally rendered, so this newsfeed is UNMOUNTED while
  // the user is on the Explore tab where the pinned auto-join runs — a live
  // pulse then has no listener. So on mount we also consume any pulse that fired
  // while we were unmounted and refresh once, ensuring the just-joined pinned
  // community's posts show the first time the feed is opened.
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const doRefresh = () => {
      consumeFeedRefresh();
      refreshRef.current();
      // The membership change may not be reflected in the global-feed query the
      // instant we refresh, so re-refresh once after a short delay to catch the
      // server propagation window.
      timeouts.push(setTimeout(() => refreshRef.current(), 1500));
    };
    // Catch a pulse that fired while this newsfeed was unmounted (user was on
    // the Explore tab during the pinned auto-join).
    if (hasPendingFeedRefresh()) doRefresh();
    const unsubscribe = subscribeFeedRefresh(doRefresh);
    return () => {
      unsubscribe();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Hold a loading state while the auto-join runs. Reuse the Feed's skeletons by
  // forcing its first-page loading flag, so the transition looks like a normal
  // loading feed rather than an empty state.
  if (isAutoJoinInProgress) {
    return (
      <PullToRefresh className={styles.newsfeed} style={themeStyles} onTouchEndCallback={refresh}>
        <Divider isShown={!isDesktop} />
        <PostComposer pageId={pageId} />
        <Feed
          pageId={pageId}
          componentId={componentId}
          posts={[]}
          newPosts={[]}
          isLoading
          isLoadingFirstPage
          hasMore={false}
          globalFeaturedPosts={[]}
          isGlobalFeaturedPostsLoading
          onFeedReachBottom={() => {}}
          onPostDeleted={() => {}}
        />
      </PullToRefresh>
    );
  }

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
