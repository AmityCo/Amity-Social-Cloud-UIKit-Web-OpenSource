import React, { useEffect, useRef, useState } from 'react';

import { Comment } from '~/v4/social/components/Comment/Comment';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommentRepository, SubscriptionLevels } from '@amityco/ts-sdk';
import { usePaginator } from '~/v4/core/hooks/usePaginator';
import { CommentAd } from '~/v4/social/internal-components/CommentAd/CommentAd';
import { CommentSkeleton } from '~/v4/social/components/Comment/CommentSkeleton';
import styles from './CommentList.module.css';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useNetworkState } from 'react-use';
import Redo from '~/v4/icons/Redo';

type CommentListProps = {
  referenceId: string;
  referenceType: Amity.CommentReferenceType;
  pageId?: string;
  onClickReply: (comment: Amity.Comment) => void;
  limit?: number;
  includeDeleted?: boolean;
  community?: Amity.Community | null;
  shouldAllowInteraction?: boolean;
  commentCount?: number;
  renderReplyComment?: (comment: Amity.Comment) => React.ReactNode;
};

const isAmityAd = (item: Amity.Comment | Amity.InternalComment | Amity.Ad): item is Amity.Ad => {
  return 'adId' in item;
};

export const CommentList = ({
  referenceId,
  referenceType,
  pageId = '*',
  onClickReply,
  limit = 5,
  includeDeleted = true,
  community,
  shouldAllowInteraction = true,
  commentCount = 0,
  renderReplyComment,
}: CommentListProps) => {
  const componentId = 'comment_tray_component';
  const { online } = useNetworkState();
  const { isDesktop } = useResponsive();

  const { themeStyles, accessibilityId } = useAmityComponent({
    componentId,
    pageId,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);

  const { items, refresh, loadMore, hasMore, isLoading } = usePaginator({
    fetcher: CommentRepository.getComments,
    params: {
      referenceId,
      referenceType,
      limit,
      includeDeleted,
    },
    placement: 'comment' as Amity.AdPlacement,
    pageSize: 5,
    getItemId: (item) => item.commentId,
    shouldCall: true,
  });

  useIntersectionObserver({
    node: intersectionNode,
    options: {
      threshold: 0.8,
    },
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
  });

  useEffect(() => {
    refresh();
  }, []);

  if (!online) {
    return (
      <div className={styles.noCommentsContainer}>
        <Redo className={styles.noCommentsContainer__icon} />
        <Typography.Body>Unable to load comments</Typography.Body>
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className={styles.noCommentsContainer}>
        <Typography.Body>No comments yet</Typography.Body>
      </div>
    );
  }

  return (
    <div
      className={styles.commentList__container}
      style={themeStyles}
      ref={containerRef}
      data-qa-anchor={accessibilityId}
    >
      {items.map((item) => {
        return isAmityAd(item) ? (
          <CommentAd key={item.adId} ad={item} />
        ) : (
          <div key={(item as Amity.Comment).commentId}>
            <Comment
              pageId={pageId}
              comment={item as Amity.Comment}
              onClickReply={(comment) => onClickReply?.(comment)}
              componentId={componentId}
              community={community}
              shouldAllowInteraction={shouldAllowInteraction}
            />
            {renderReplyComment?.(item as Amity.Comment)}
          </div>
        );
      })}

      {isDesktop && !expanded && items.length < commentCount && (
        <Button
          className={styles.commentList__viewAllComments__button}
          variant="text"
          onPress={() => {
            loadMore();
            setExpanded(true);
          }}
        >
          <Typography.BodyBold className={styles.commentList__viewAllComments__button__text}>
            View all comments...
          </Typography.BodyBold>
        </Button>
      )}

      {isLoading && (
        <CommentSkeleton pageId={pageId} componentId={componentId} numberOfSkeletons={3} />
      )}

      {(!isDesktop || (isDesktop && expanded)) && (
        <div
          ref={(node) => setIntersectionNode(node)}
          className={styles.commentList__container_intersection}
        />
      )}
    </div>
  );
};
