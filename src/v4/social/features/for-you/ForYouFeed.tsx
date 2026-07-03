import { Divider } from '~/v4/social/elements/Divider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { Feed } from '~/v4/social/features/shared/components/Feed';
import { FeedCaughtUp } from '~/v4/social/components/FeedCaughtUp';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { useSocialHomePageTab } from '~/v4/social/features/home/hooks';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { useForYouFeedCollection } from '~/v4/social/hooks/collections/useForYouFeedCollection';
import styles from './ForYouFeed.module.css';

type ForYouFeedProps = {
  pageId: string;
};

export function ForYouFeed({ pageId }: ForYouFeedProps) {
  const componentId = COMPONENT_ID.FOR_YOU_FEED_COMPONENT;

  const { isDesktop } = useResponsive();
  const { themeStyles } = useAmityComponent({ pageId, componentId });
  const { setActiveTab } = useLayoutContext();
  const [, setPersistedTab] = useSocialHomePageTab();

  const { newPosts, globalFeaturedPostsItems, removeNewPost } = useGlobalFeedContext();

  const { posts, isLoading, isLoadingFirstPage, hasMore, loadMore, refresh } =
    useForYouFeedCollection();

  const onFeedReachBottom = () => {
    if (hasMore && !isLoading && !isLoadingFirstPage) loadMore();
  };

  const handleSwitchToFollowing = () => {
    setActiveTab(HomePageTab.Newsfeed);
    setPersistedTab(HomePageTab.Newsfeed);
  };

  const showCaughtUp = !hasMore && !isLoading && !isLoadingFirstPage;

  return (
    <PullToRefresh className={styles.forYouFeed} style={themeStyles} onTouchEndCallback={refresh}>
      <div className={styles.forYouFeed__storyTab}>
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
        withAnalytics
        onFeedReachBottom={onFeedReachBottom}
        onPostDeleted={(post) => {
          if (post?.postId) removeNewPost(post.postId);
        }}
      />
      {showCaughtUp && <FeedCaughtUp pageId={pageId} onSwitchRequested={handleSwitchToFollowing} />}
    </PullToRefresh>
  );
}
