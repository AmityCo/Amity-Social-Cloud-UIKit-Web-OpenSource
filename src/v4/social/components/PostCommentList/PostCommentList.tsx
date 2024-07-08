import React, { useRef } from 'react';
import styles from './PostCommentList.module.css';
import { PostComment } from '../PostComment/PostComment';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useCommentsCollection from '../../hooks/collections/useCommentsCollection';
import { useAmityComponent } from '~/v4/core/hooks/uikit/index';
import useUserSubscription from '~/v4/core/hooks/subscriptions/useUserSubscription';
import { SubscriptionLevels } from '@amityco/ts-sdk';
import useCommunitySubscription from '~/v4/core/hooks/subscriptions/useCommunitySubscription';

type PostCommentListProps = {
  post: Amity.Post;
  pageId?: string;
  onClickReply: (comment: Amity.Comment) => void;
};

export const PostCommentList = ({ post, pageId = '*', onClickReply }: PostCommentListProps) => {
  const componentId = 'comment_tray_component';

  const { themeStyles, accessibilityId } = useAmityComponent({
    componentId,
    pageId,
  });

  const containerRef = React.useRef<HTMLDivElement>(null);
  const intersectionRef = useRef<HTMLDivElement>(null);

  const { comments, loadMore, hasMore, isLoading } = useCommentsCollection({
    referenceId: post.postId,
    referenceType: 'post',
    limit: 5,
    includeDeleted: true,
  });

  useIntersectionObserver({
    ref: intersectionRef,
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
  });

  useUserSubscription({
    userId: post.targetId,
    level: SubscriptionLevels.COMMENT,
    shouldSubscribe: post.targetType === 'user',
  });

  useCommunitySubscription({
    communityId: post.targetId,
    level: SubscriptionLevels.COMMENT,
    shouldSubscribe: post.targetType === 'community',
  });

  if (!comments) return null;

  return (
    <div
      className={styles.postCommentList__container}
      style={themeStyles}
      ref={containerRef}
      data-qa-anchor={accessibilityId}
    >
      {comments.map((comment) => {
        return (
          <PostComment
            key={comment.commentId}
            comment={comment as Amity.Comment}
            onClickReply={onClickReply}
            componentId={componentId}
            postTargetId={post.targetId}
            postTargetType={post.targetType}
          />
        );
      })}
      {/* TODO: add this button when implement desktop view  */}
      {/* <div className={styles.postCommentList__viewAllComments__button}>
        <Typography.BodyBold>View all comments...</Typography.BodyBold>
      </div> */}
      <div ref={intersectionRef} className={styles.postCommentList__container_intersection} />
    </div>
  );
};
