import React, { useEffect, useState } from 'react';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { ImageGallery } from '~/v4/social/internal-components/ImageGallery';
import { EmptyUserImageFeed } from '~/v4/social/elements/EmptyUserImageFeed/EmptyUserImageFeed';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { PrivateUserImageFeed } from '~/v4/social/elements/PrivateUserImageFeed';
import { BlockedUserImageFeed } from '~/v4/social/elements/BlockedUserImageFeed';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { ErrorContent } from '~/v4/social/internal-components/ErrorContent';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import styles from './UserImageFeed.module.css';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { MediaFeedSkeleton } from '~/v4/social/internal-components/MediaFeedSkeleton';

interface UserImageFeedProps {
  userId: string;
  pageId?: string;
}

export const UserImageFeed = ({ pageId = '*', userId }: UserImageFeedProps) => {
  const componentId = 'user_image_feed';
  const { linkToPost, setLinkToPost } = useLayoutContext();

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, error, isLoading } = usePostsCollection({
    targetId: userId,
    targetType: 'user',
    limit: linkToPost ? (linkToPost.index >= 10 ? linkToPost.index + 10 : 10) : 10,
    dataTypes: ['image'],
  });

  const { followStatus } = useFollowCount(userId);

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
    if (followStatus === 'blocked')
      return <BlockedUserImageFeed pageId={pageId} componentId={componentId} />;

    if (error) {
      return error.message.includes('You are not following this user') ? (
        <PrivateUserImageFeed pageId={pageId} componentId={componentId} />
      ) : (
        <ErrorContent />
      );
    }

    if (!isLoading && posts.length === 0)
      return <EmptyUserImageFeed pageId={pageId} componentId={componentId} />;

    return (
      <div className={styles.userImageFeed__container}>
        <ImageGallery isLoading={isLoading} target="user" posts={posts as Amity.Post<'image'>[]} />
      </div>
    );
  };

  return (
    <div data-testid={accessibilityId} style={themeStyles}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        <>
          {renderImageFeed(posts)}
          {isLoading && (
            <div className={styles.userImageFeed__container}>
              <MediaFeedSkeleton />
            </div>
          )}
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
