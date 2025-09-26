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

interface UserImageFeedProps {
  userId: string;
  pageId?: string;
}

export const UserImageFeed = ({ pageId = '*', userId }: UserImageFeedProps) => {
  const componentId = 'user_image_feed';

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, error, isLoading } = usePostsCollection({
    targetId: userId,
    targetType: 'user',
    limit: 10,
    dataTypes: ['image'],
  });

  const { followStatus } = useFollowCount(userId);

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

  useEffect(() => {
    refresh();
  }, []);

  const renderImageFeed = () => {
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
        <ImageGallery posts={posts as Amity.Post<'image'>[]} />
      </div>
    );
  };

  return (
    <div data-testid={accessibilityId} style={themeStyles}>
      <NoInternetConnectionHoc page="feed" refresh={refresh}>
        <>
          {renderImageFeed()}
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
