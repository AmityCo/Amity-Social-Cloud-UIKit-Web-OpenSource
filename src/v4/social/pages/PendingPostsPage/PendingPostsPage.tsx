import React, { useEffect } from 'react';
import styles from './PendingPostsPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements';
import { Title } from '~/v4/social/elements/Title';
import { Typography } from '~/v4/core/components';
import { useCommunityInfo } from '~/v4/social/hooks';
import { PendingPostContent } from '~/v4/social/components/PendingPostContent';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import FireworkPaper from '~/v4/icons/FireworkPaper';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { PendingPostSkeleton } from './PendingPostsSkeleton';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

type PendingPostsPageProps = {
  communityId: string;
};

export const PendingPostsPage = ({ communityId }: PendingPostsPageProps) => {
  const pageId = 'pending_posts_page';
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });
  const { isDesktop } = useResponsive();
  const { onBack } = useNavigation();
  const { currentUserId } = useSDK();
  const { pendingPostsCount, canReviewCommunityPosts } = useCommunityInfo(communityId);
  const {
    posts: reviewingPosts,
    isLoading,
    refresh,
  } = usePostsCollection({
    targetType: 'community',
    targetId: communityId,
    feedType: 'reviewing',
  });

  const isPostOwner = reviewingPosts.some((post) => post.postedUserId === currentUserId);

  //TODO : after SDK fix live collection to support update pending post list, remove this useEffect
  useEffect(() => {
    refresh();
  }, [reviewingPosts.length]);

  return (
    <div
      data-testid={accessibilityId}
      className={styles.pendingPostsPage__container}
      style={themeStyles}
    >
      <div
        className={styles.pendingPostsPage__topBar}
        data-review={canReviewCommunityPosts || isDesktop}
      >
        <BackButton onPress={() => onBack()} />
        <div className={styles.pendingPostsPage__titleWrap}>
          <Title titleClassName={styles.pendingPostsPage__title} pageId={pageId} />
          <Typography.TitleBold>{`(${pendingPostsCount})`}</Typography.TitleBold>
        </div>
        <div className={styles.pendingPostsPage__emptyDiv} />
      </div>
      {(canReviewCommunityPosts || isDesktop) && (
        <div className={styles.pendingPostsPage__descWrap}>
          <Typography.Caption className={styles.pendingPostsPage__desc}>
            Decline pending post will permanently delete the selected post from community.
          </Typography.Caption>
        </div>
      )}
      {isLoading && (
        <div className={styles.pendingPostsPage__pendingPostSkeletons}>
          {Array.from({ length: 3 }).map((_, index) => (
            <PendingPostSkeleton key={index} />
          ))}
        </div>
      )}
      {reviewingPosts.length === 0 && !isLoading && (
        <div className={styles.pendingPostsPage__noPendingPost}>
          <FireworkPaper className={styles.pendingPostsPage__fireworkIcon} />
          <Typography.TitleBold className={styles.pendingPostsPage__noPendingPostText}>
            No post to review
          </Typography.TitleBold>
        </div>
      )}
      {!isLoading && pendingPostsCount > 0 && (canReviewCommunityPosts || isPostOwner) && (
        <>
          {reviewingPosts.length > 0 && (
            <div className={styles.pendingPostsPage__list}>
              {reviewingPosts?.map((post) => (
                <PendingPostContent
                  post={post}
                  pageId={pageId}
                  canReviewCommunityPosts={canReviewCommunityPosts}
                  refresh={refresh}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
