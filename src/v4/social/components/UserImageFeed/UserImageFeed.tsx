import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { ImageGallery } from '~/v4/social/internal-components/ImageGallery';
import { EmptyUserImageFeed } from '~/v4/social/elements/EmptyUserImageFeed/EmptyUserImageFeed';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { PrivateUserImageFeed } from '~/v4/social/elements/PrivateUserImageFeed';
import { BlockedUserImageFeed } from '~/v4/social/elements/BlockedUserImageFeed';
import { ErrorContent } from '~/v4/social/internal-components/ErrorContent';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { MediaFeedSkeleton } from '~/v4/social/internal-components/MediaFeedSkeleton';
import useUserFeed from '~/v4/social/hooks/collections/useUserFeed';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import styles from './UserImageFeed.module.css';
import { FeedSourceEnum, FeedDataTypeEnum } from '@amityco/ts-sdk';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';

interface UserImageFeedProps {
  userId: string;
  pageId?: string;
  feedSources?: FeedSourceEnum[];
  followStatus?: Amity.FollowStatus['status'] | null;
}

export const UserImageFeed = ({
  pageId = '*',
  userId,
  feedSources,
  followStatus,
}: UserImageFeedProps) => {
  const componentId = 'user_image_feed';
  const { linkToPost, setLinkToPost } = useLayoutContext();

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const limit = useRef(linkToPost ? (linkToPost.index >= 10 ? linkToPost.index + 10 : 10) : 10);

  const dataTypes = useMemo(() => {
    return [FeedDataTypeEnum.Image];
  }, []);

  const { posts, hasMore, loadMore, refresh, error, isLoading } = useUserFeed({
    userId,
    feedSources,
    limit: limit.current,
    dataTypes,
  });

  useEffect(() => {
    if (posts.length === 0 && !isLoading) setLinkToPost(null);
  }, [posts, isLoading]);

  useIntersectionObserver({
    node: intersectionNode,
    options: { threshold: 0.7 },
    onIntersect: () => {
      if (isLoading === false) loadMore();
    },
  });

  const renderImageFeed = (posts: Amity.Post<any>[]) => {
    if (!isLoading && followStatus === 'blocked')
      return <BlockedUserImageFeed pageId={pageId} componentId={componentId} />;

    if (!isLoading && error?.message.includes(ERROR_RESPONSE.NOT_FOLLOWING_USER))
      return <PrivateUserImageFeed pageId={pageId} componentId={componentId} />;

    if (!isLoading && error) return <ErrorContent />;

    if (!isLoading && posts.length === 0)
      return <EmptyUserImageFeed pageId={pageId} componentId={componentId} />;

    return (
      <div className={styles.userImageFeed__container}>
        <ImageGallery
          target="user"
          isLoading={isLoading}
          feedSources={feedSources}
          posts={posts as Amity.Post<'image'>[]}
        />
        {isLoading && <MediaFeedSkeleton />}
      </div>
    );
  };

  return (
    <div data-testid={accessibilityId} style={themeStyles}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        <>
          {renderImageFeed(posts)}
          {hasMore && (
            <div
              ref={(node) => setIntersectionNode(node)}
              className={styles.userImageFeed__observerTarget}
            />
          )}
        </>
      </NoInternetConnectionHoc>
    </div>
  );
};
