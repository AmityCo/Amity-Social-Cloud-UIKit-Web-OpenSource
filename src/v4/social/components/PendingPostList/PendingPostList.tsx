import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PostsTabDescription } from '~/v4/social/elements';
import React from 'react';
import styles from './PendingPostList.module.css';
import FireworkPaper from '~/v4/icons/FireworkPaper';
import { PendingPostContent } from '~/v4/social/components/PendingPostContent/PendingPostContent';
import { Divider } from '~/v4/social/elements/Divider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

type PendingPostListProps = {
  pageId?: string;
  reviewingPosts: Amity.Post[];
  canReviewCommunityPosts?: boolean;
  refresh?: () => void;
};

export const PendingPostList = ({
  pageId = '*',
  reviewingPosts,
  canReviewCommunityPosts = false,
  refresh,
}: PendingPostListProps) => {
  const componentId = 'pending_post_list';
  const { isDesktop } = useResponsive();

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const renderPendingPost = (post: Amity.Post) => {
    return (
      <PendingPostContent
        key={post.postId}
        pageId={pageId}
        post={post}
        canReviewCommunityPosts={canReviewCommunityPosts}
        refresh={refresh}
      />
    );
  };

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <PostsTabDescription pageId={pageId} componentId={componentId} />
      {reviewingPosts.length > 0 &&
        reviewingPosts.map((post, index) => (
          <div className={styles.pendingPostList__wrapper} key={post.postId}>
            {renderPendingPost(post)}
            {!isDesktop && index !== reviewingPosts.length - 1 && <Divider />}
          </div>
        ))}
      {reviewingPosts.length === 0 && (
        <div className={styles.pendingPostList__noJoinRequest}>
          <FireworkPaper className={styles.pendingPostList__fireworkIcon} />
          <Typography.TitleBold className={styles.pendingPostList__noJoinRequestText}>
            {useString('amity_social_label_no_pending_posts')}
          </Typography.TitleBold>
        </div>
      )}
    </div>
  );
};
