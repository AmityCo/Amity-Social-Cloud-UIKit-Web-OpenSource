import React, { useEffect, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EmptyCommunityVideoFeed } from '~/v4/social/elements/EmptyCommunityVideoFeed';
import { VideoGallery } from '~/v4/social/internal-components/VideoGallery';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import LockPrivateContent from '~/v4/social/internal-components/LockPrivateContent';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { TabButton } from '~/v4/social/elements/TabButton/TabButton';
import { ClipGallery } from '~/v4/social/internal-components/ClipGallery/ClipGallery';
import { TabType } from '~/v4/social/constants/videoTabs';
import { EmptyClipFeed } from '~/v4/social/elements/EmptyClipFeed/EmptyClipFeed';
import styles from './CommunityVideoFeed.module.css';

type CommunityVideoFeedProps = {
  pageId?: string;
  communityId: string;
};

export const CommunityVideoFeed = ({ pageId = '*', communityId }: CommunityVideoFeedProps) => {
  const componentId = 'community_video_feed';

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const [intersectionClipNode, setIntersectionClipNode] = useState<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.VIDEOS);

  const { community } = useCommunity({ communityId, shouldCall: !!communityId });
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, isLoading } = usePostsCollection({
    targetId: communityId,
    targetType: 'community',
    limit: 10,
    dataTypes: ['video'],
  });

  const {
    posts: clipPost,
    hasMore: hasMoreClips,
    loadMore: loadMoreClips,
    refresh: refreshClips,
    isLoading: isLoadingClips,
  } = usePostsCollection({
    targetId: communityId,
    targetType: 'community',
    limit: 10,
    dataTypes: ['clip'],
  });

  const isMemberPrivateCommunity = community?.isJoined && !community?.isPublic;

  if (isExcluded) return null;

  useEffect(() => {
    refresh();
    refreshClips();
  }, []);

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && !isLoading) loadMore();
    },
  });

  useIntersectionObserver({
    node: intersectionClipNode,
    onIntersect: () => {
      if (hasMoreClips && !isLoadingClips) loadMoreClips();
    },
  });

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
      <div className={styles.communityVideoFeed__videoFeedTabs}>
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

  const renderLoading = () => {
    return (
      <div className={styles.communityVideoFeed__containerSkeleton}>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
      </div>
    );
  };

  if (!(isMemberPrivateCommunity || community?.isPublic))
    return (
      <div className={styles.communityVideoFeed__lock}>
        <LockPrivateContent />
      </div>
    );

  const renderContent = () => {
    if (activeTab === TabType.VIDEOS) {
      return (
        <>
          {posts?.length === 0 && !isLoading && (
            <EmptyCommunityVideoFeed pageId={pageId} componentId={componentId} />
          )}
          {posts?.length > 0 && (
            <VideoGallery
              posts={posts as Amity.Post<'video'>[]}
              pageId={pageId}
              componentId={communityId}
            />
          )}
          {isLoading && renderLoading()}
          {hasMore && <div ref={(node) => setIntersectionNode(node)} />}
        </>
      );
    } else {
      return (
        <>
          {clipPost?.length === 0 && !isLoadingClips && (
            <EmptyClipFeed pageId={pageId} componentId={componentId} />
          )}
          {clipPost?.length > 0 && (
            <ClipGallery
              posts={clipPost as Amity.Post<'clip'>[]}
              pageId={pageId}
              componentId={communityId}
            />
          )}
          {isLoadingClips && renderLoading()}
          {hasMoreClips && <div ref={(node) => setIntersectionClipNode(node)} />}
        </>
      );
    }
  };

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        <>
          {renderTabs()}
          <div className={styles.communityVideoFeed__container}>{renderContent()}</div>
        </>
      </NoInternetConnectionHoc>
    </div>
  );
};
