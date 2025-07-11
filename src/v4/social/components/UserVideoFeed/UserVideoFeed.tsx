import React, { useEffect, useState } from 'react';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { VideoGallery } from '~/v4/social/internal-components/VideoGallery';
import { EmptyUserVideoFeed } from '~/v4/social/elements/EmptyUserVideoFeed/EmptyUserVideoFeed';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { PrivateUserVideoFeed } from '~/v4/social/elements/PrivateUserVideoFeed';
import { BlockedUserVideoFeed } from '~/v4/social/elements/BlockedUserVideoFeed';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { ErrorContent } from '~/v4/social/internal-components/ErrorContent';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { TabButton } from '~/v4/social/elements/TabButton';
import { ClipGallery } from '~/v4/social/internal-components/ClipGallery/ClipGallery';
import { TabType } from '~/v4/social/constants/videoTabs';
import { EmptyClipFeed } from '~/v4/social/elements/EmptyClipFeed';
import styles from './UserVideoFeed.module.css';

interface UserVideoFeedProps {
  userId: string;
  pageId?: string;
}

export const UserVideoFeed = ({ pageId = '*', userId }: UserVideoFeedProps) => {
  const componentId = 'user_video_feed';
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const [intersectionClipNode, setIntersectionClipNode] = useState<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>(TabType.VIDEOS);

  const { followStatus } = useFollowCount(userId);

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, error, isLoading } = usePostsCollection({
    targetId: userId,
    targetType: 'user',
    limit: 10,
    dataTypes: ['video'],
  });

  const {
    posts: clipPost,
    hasMore: hasMoreClips,
    loadMore: loadMoreClips,
    refresh: refreshClips,
    error: errorClips,
    isLoading: isLoadingClips,
  } = usePostsCollection({
    targetId: userId,
    targetType: 'user',
    limit: 10,
    dataTypes: ['clip'],
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
    refresh();
    refreshClips();
  }, []);

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
    if (followStatus === 'blocked')
      return <BlockedUserVideoFeed pageId={pageId} componentId={componentId} />;

    if (error) {
      return error.message.includes('You are not following this user') ? (
        <PrivateUserVideoFeed pageId={pageId} componentId={componentId} />
      ) : (
        <ErrorContent />
      );
    }

    if (activeTab === TabType.VIDEOS && !isLoading && posts.length === 0)
      return <EmptyUserVideoFeed pageId={pageId} componentId={componentId} />;

    if (activeTab === TabType.CLIPS && !isLoadingClips && clipPost.length === 0)
      return <EmptyClipFeed pageId={pageId} componentId={componentId} />;

    return (
      <div className={styles.userVideoFeed__container}>
        {activeTab === TabType.VIDEOS ? (
          <VideoGallery posts={posts as Amity.Post<'video'>[]} />
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
    <div data-testid={accessibilityId} style={themeStyles}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        <>
          {renderTabs()}
          {renderContent()}
        </>
      </NoInternetConnectionHoc>
    </div>
  );
};
