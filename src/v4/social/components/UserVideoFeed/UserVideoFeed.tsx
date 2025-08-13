import React, { useEffect, useRef, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { VideoGallery } from '~/v4/social/internal-components/VideoGallery';
import { EmptyUserVideoFeed } from '~/v4/social/elements/EmptyUserVideoFeed/EmptyUserVideoFeed';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { PrivateUserVideoFeed } from '~/v4/social/elements/PrivateUserVideoFeed';
import { BlockedUserVideoFeed } from '~/v4/social/elements/BlockedUserVideoFeed';
import { ErrorContent } from '~/v4/social/internal-components/ErrorContent';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { TabButton } from '~/v4/social/elements/TabButton';
import { ClipGallery } from '~/v4/social/internal-components/ClipGallery/ClipGallery';
import { TabType } from '~/v4/social/constants/videoTabs';
import { EmptyClipFeed } from '~/v4/social/elements/EmptyClipFeed';
import { MediaFeedSkeleton } from '~/v4/social/internal-components/MediaFeedSkeleton';
import useUserFeed from '~/v4/social/hooks/collections/useUserFeed';
import styles from './UserVideoFeed.module.css';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { FeedSourceEnum, FeedDataTypeEnum } from '@amityco/ts-sdk';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';

interface UserVideoFeedProps {
  userId: string;
  pageId?: string;
  feedSources?: FeedSourceEnum[];
  followStatus?: Amity.FollowStatus['status'] | null;
}

export const UserVideoFeed = ({
  pageId = '*',
  userId,
  feedSources,
  followStatus,
}: UserVideoFeedProps) => {
  const componentId = 'user_video_feed';
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const [intersectionClipNode, setIntersectionClipNode] = useState<HTMLDivElement | null>(null);
  const { linkToPost, setLinkToPost } = useLayoutContext();
  const [activeTab, setActiveTab] = useState<TabType>(TabType.VIDEOS);

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const limit = useRef(linkToPost ? (linkToPost.index >= 10 ? linkToPost.index + 10 : 10) : 10);

  const { posts, hasMore, loadMore, refresh, error, isLoading } = useUserFeed({
    userId,
    feedSources,
    limit: limit.current,
    dataTypes: [FeedDataTypeEnum.Video],
  });

  const {
    posts: clipPost,
    hasMore: hasMoreClips,
    loadMore: loadMoreClips,
    refresh: refreshClips,
    error: errorClips,
    isLoading: isLoadingClips,
  } = useUserFeed({
    userId,
    feedSources,
    limit: limit.current,
    dataTypes: [FeedDataTypeEnum.Clip],
  });

  useIntersectionObserver({
    onIntersect: () => {
      if (isLoading === false) {
        loadMore();
      }
    },
    node: intersectionNode,
    options: {
      threshold: 0.7,
    },
  });

  useIntersectionObserver({
    onIntersect: () => {
      if (isLoadingClips === false) {
        loadMoreClips();
      }
    },
    node: intersectionClipNode,
    options: {
      threshold: 0.7,
    },
  });

  useEffect(() => {
    if (posts.length === 0 && !isLoading) setLinkToPost(null);
  }, [posts, isLoading]);

  useEffect(() => {
    if (posts.length === 0 && !isLoading) setLinkToPost(null);
  }, [posts, isLoading]);

  const tabs = [
    {
      type: TabType.VIDEOS,
      elementId: 'videos_button',
    },
    {
      type: TabType.CLIPS,
      elementId: 'clips_button',
    },
  ];

  const renderTabs = () => {
    return (
      <div className={styles.userVideoFeed__videoFeedTabs}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.type}
            pageId={pageId}
            componentId={componentId}
            elementId={tab.elementId}
            tab={tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>
    );
  };

  const renderFeed = (posts: Amity.Post[], isLoading: boolean, error: Error | null) => {
    if (!isLoading && followStatus === 'blocked')
      return <BlockedUserVideoFeed pageId={pageId} componentId={componentId} />;

    if (!isLoading && error?.message.includes(ERROR_RESPONSE.NOT_FOLLOWING_USER))
      return <PrivateUserVideoFeed pageId={pageId} componentId={componentId} />;

    if (!isLoading && !isLoadingClips && error) return <ErrorContent />;

    if (activeTab === TabType.VIDEOS && !isLoading && posts.length === 0)
      return <EmptyUserVideoFeed pageId={pageId} componentId={componentId} />;

    if (activeTab === TabType.CLIPS && !isLoadingClips && clipPost.length === 0)
      return <EmptyClipFeed pageId={pageId} componentId={componentId} />;

    return (
      <div className={styles.userVideoFeed__container}>
        {activeTab === TabType.VIDEOS ? (
          <>
            <VideoGallery
              posts={posts as Amity.Post<'video'>[]}
              isLoading={isLoading}
              feedSources={feedSources}
            />
            {isLoading && <MediaFeedSkeleton />}
          </>
        ) : (
          <ClipGallery posts={posts as Amity.Post<'clip'>[]} />
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === TabType.VIDEOS) {
      return (
        <>
          {renderFeed(posts, isLoading, error)}
          {hasMore && (
            <div
              ref={(node) => setIntersectionNode(node)}
              className={styles.userVideoFeed__observerTarget}
            />
          )}
        </>
      );
    } else {
      return (
        <>
          {renderFeed(clipPost, isLoadingClips, errorClips)}
          {hasMoreClips && (
            <div
              ref={(node) => setIntersectionClipNode(node)}
              className={styles.userVideoFeed__observerTarget}
            />
          )}
        </>
      );
    }
  };

  return (
    <div data-testid={accessibilityId} style={themeStyles} className={styles.userVideoFeed}>
      <NoInternetConnectionHoc
        page="feed"
        refresh={() => {
          refresh();
          refreshClips();
        }}
      >
        <>
          {renderTabs()}
          {renderContent()}
        </>
      </NoInternetConnectionHoc>
    </div>
  );
};
