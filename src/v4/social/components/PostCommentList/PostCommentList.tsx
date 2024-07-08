import React, { useRef } from 'react';
import styles from './PostCommentList.module.css';
import { PostComment } from '../PostComment/PostComment';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useCommentsCollection from '../../hooks/collections/useCommentsCollection';
import { useAmityComponent } from '~/v4/core/hooks/uikit/index';
import useUserSubscription from '~/v4/core/hooks/subscriptions/useUserSubscription';
import { CommentRepository, SubscriptionLevels } from '@amityco/ts-sdk';
import useCommunitySubscription from '~/v4/core/hooks/subscriptions/useCommunitySubscription';
import { usePaginator } from '~/v4/core/hooks/usePagination';
import { CommentAd } from '../../internal-components/CommentAd/CommentAd';

type PostCommentListProps = {
  post: Amity.Post;
  pageId?: string;
  onClickReply: (comment: Amity.Comment) => void;
};

const isAmityAd = (item: Amity.Comment | Amity.InternalComment | Amity.Ad): item is Amity.Ad => {
  return 'adId' in item;
};

export const PostCommentList = ({ post, pageId = '*', onClickReply }: PostCommentListProps) => {
  const componentId = 'comment_tray_component';

  const { themeStyles, accessibilityId } = useAmityComponent({
    componentId,
    pageId,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const intersectionRef = useRef<HTMLDivElement>(null);

  const { items, loadMore, hasMore, isLoading } = usePaginator({
    fetcher: CommentRepository.getComments,
    params: {
      referenceId: post.postId,
      referenceType: 'post',
      limit: 5,
      includeDeleted: true,
    },
    placement: 'comment' as Amity.AdPlacement,
    pageSize: 5,
    getItemId: (item) => item.commentId,
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

  return (
    <div
      className={styles.postCommentList__container}
      style={themeStyles}
      ref={containerRef}
      data-qa-anchor={accessibilityId}
    >
      {items.map((item) => {
        return isAmityAd(item) ? (
          <CommentAd key={item.adId} ad={item} />
        ) : (
          <PostComment
            key={item.commentId}
            comment={item as Amity.Comment}
            onClickReply={(comment) => onClickReply?.(comment)}
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
      {!isLoading && (
        <div ref={intersectionRef} className={styles.postCommentList__container_intersection} />
      )}
    </div>
  );
};
