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
import { useModuleFilteredPosts } from '~/v4/social/hooks/useModuleFilteredPosts';
import styles from './ForYouFeed.module.css';

type ForYouFeedProps = {
  pageId: string;
};

export function ForYouFeed({ pageId }: ForYouFeedProps) {
  // Spelled out, like Newsfeed's own id: apollo reads declared component ids as
  // literals, so a constant reference is invisible to X24 and the parity gap
  // stays reported after it is closed.
  const componentId = 'amity_for_you_feed_component';

  const { isDesktop } = useResponsive();
  const { themeStyles, isExcluded } = useAmityComponent({ pageId, componentId });
  const { setActiveTab } = useLayoutContext();
  const [, setPersistedTab] = useSocialHomePageTab();

  const { newPosts, postRatioOverrides, globalFeaturedPostsItems, removeNewPost } =
    useGlobalFeedContext();

  const {
    posts: feedPosts,
    isLoading,
    isLoadingFirstPage,
    hasMore,
    loadMore,
    refresh,
  } = useForYouFeedCollection();

  // getForYouFeed takes no parameters at all, so this is the only place a
  // switched-off Poll or Live can leave the feed.
  const posts = useModuleFilteredPosts(feedPosts);

  const onFeedReachBottom = () => {
    if (hasMore && !isLoading && !isLoadingFirstPage) loadMore();
  };

  const handleSwitchToFollowing = () => {
    setActiveTab(HomePageTab.Newsfeed);
    setPersistedTab(HomePageTab.Newsfeed);
  };

  const showCaughtUp = !hasMore && !isLoading && !isLoadingFirstPage;

  // Feed off left this whole pane rendering. The tab that reaches it was gated,
  // which hides the door and not the room — and the collection above kept
  // fetching. Below the hooks so the hook count does not move with the flag.
  if (isExcluded) return null;

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
        postRatioOverrides={postRatioOverrides}
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
