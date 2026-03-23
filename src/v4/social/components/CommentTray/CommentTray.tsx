import React, { useCallback, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommentList } from '~/v4/social/components/CommentList';
import { CommentComposer } from '~/v4/social/components/CommentComposer';
import styles from './CommentTray.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import useSDK from '~/v4/core/hooks/useSDK';

type CommentTrayProps = {
  pageId?: string;
  referenceId: string;
  community: Amity.Community;
  shouldAllowCreation?: boolean;
  shouldAllowInteraction?: boolean;
  referenceType: Amity.CommentReferenceType;
};

export const CommentTray = ({
  referenceId,
  pageId = '*',
  referenceType,
  shouldAllowCreation = true,
  shouldAllowInteraction = true,
  community = {} as Amity.Community,
}: CommentTrayProps) => {
  const componentId = 'comment_tray_component';

  const { isDesktop } = useResponsive();
  const { isVisitorOrBot } = useSDK();
  const [replyTo, setReplyTo] = useState<Amity.Comment | undefined>();
  const [replyParentIdOverride, setReplyParentIdOverride] = useState<string | undefined>(undefined);
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });

  const onCancelReply = useCallback(() => {
    setReplyTo(undefined);
    setReplyParentIdOverride(undefined);
  }, []);

  const onClickReply = useCallback(
    ({
      comment,
      parentIdOverride,
    }: {
      comment: Amity.Comment;
      parentIdOverride?: string;
      l0AncestorId?: string;
    }) =>
      setReplyTo((prevComment) => {
        setReplyParentIdOverride(
          prevComment?.commentId === comment?.commentId ? undefined : parentIdOverride,
        );
        return prevComment?.commentId === comment?.commentId ? undefined : comment;
      }),
    [],
  );

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
        />
      </div>
      {shouldAllowInteraction && !isVisitorOrBot && community.isJoined && (
        <CommentComposer
          pageId={pageId}
          referenceId={referenceId}
          onCancelReply={onCancelReply}
          referenceType={referenceType}
          replyTo={replyTo}
          parentIdOverride={replyParentIdOverride}
          shouldAllowCreation={shouldAllowCreation}
          containerClassName={styles.commentTrayContainer__commentComposer}
          community={community}
        />
      )}
    </div>
  );
};
