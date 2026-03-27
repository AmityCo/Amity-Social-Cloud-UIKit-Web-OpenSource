import React, { useCallback, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommentList } from '~/v4/social/components/CommentList';
import { CommentComposer } from '~/v4/social/components/CommentComposer';
import styles from './CommentTray.module.css';
import useSDK from '~/v4/core/hooks/useSDK';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

type CommentTrayProps = {
  pageId?: string;
  referenceId: string;
  community: Amity.Community;
  shouldAllowCreation?: boolean;
  shouldAllowInteraction?: boolean;
  referenceType: Amity.CommentReferenceType;
  commentCount?: number;
};

export const CommentTray = ({
  referenceId,
  pageId = '*',
  referenceType,
  shouldAllowCreation = true,
  shouldAllowInteraction = true,
  community = {} as Amity.Community,
  commentCount,
}: CommentTrayProps) => {
  const componentId = 'comment_tray_component';

  const { isDesktop } = useResponsive();
  const { isVisitorOrBot } = useSDK();
  const [replyTo, setReplyTo] = useState<Amity.Comment | undefined>();
  const [replyParentIdOverride, setReplyParentIdOverride] = useState<string | undefined>(undefined);
  const [replyL0AncestorId, setReplyL0AncestorId] = useState<string | undefined>(undefined);
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });

  const onCancelReply = useCallback(() => {
    setReplyTo(undefined);
    setReplyParentIdOverride(undefined);
    setReplyL0AncestorId(undefined);
  }, []);

  const onClickReply = useCallback(
    ({
      comment,
      parentIdOverride,
      l0AncestorId,
    }: {
      comment: Amity.Comment;
      parentIdOverride?: string;
      l0AncestorId?: string;
    }) => {
      setReplyTo((prevComment) => {
        setReplyParentIdOverride(
          prevComment?.commentId === comment?.commentId ? undefined : parentIdOverride,
        );
        return prevComment?.commentId === comment?.commentId ? undefined : comment;
      });
      setReplyL0AncestorId(l0AncestorId);
    },
    [],
  );

  const canShowComposer = shouldAllowInteraction && !isVisitorOrBot && community.isJoined;

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.commentTrayContainer}>
      <div className={styles.commentListContainer}>
        <CommentList
          includeDeleted
          pageId={pageId}
          community={community}
          referenceId={referenceId}
          onClickReply={onClickReply}
          referenceType={referenceType}
          shouldAllowInteraction={shouldAllowInteraction}
          commentCount={commentCount}
          replyTargetCommentId={
            isDesktop && replyL0AncestorId ? replyParentIdOverride ?? replyTo?.commentId : undefined
          }
          renderReplyComment={(comment) => {
            if (!isDesktop) return undefined;
            const effectiveL0Id = replyL0AncestorId ?? replyTo?.commentId;
            if (replyTo && comment.commentId === effectiveL0Id && canShowComposer) {
              const composerMarginLeft = replyTo.parentId ? '2.5rem' : '0';
              return (
                <div style={{ marginLeft: composerMarginLeft }}>
                  <CommentComposer
                    pageId={pageId}
                    referenceId={referenceId}
                    referenceType={referenceType}
                    replyTo={replyTo}
                    parentIdOverride={replyParentIdOverride}
                    onCancelReply={onCancelReply}
                    shouldAllowCreation={shouldAllowCreation}
                    community={community}
                  />
                </div>
              );
            }
          }}
        />
      </div>
      {canShowComposer && (!replyTo || !isDesktop) && (
        <CommentComposer
          pageId={pageId}
          referenceId={referenceId}
          onCancelReply={onCancelReply}
          referenceType={referenceType}
          replyTo={isDesktop ? undefined : replyTo}
          parentIdOverride={isDesktop ? undefined : replyParentIdOverride}
          shouldAllowCreation={shouldAllowCreation}
          community={community}
          commentComposerClassName={styles.commentTrayContainer__commentComposer}
        />
      )}
    </div>
  );
};
