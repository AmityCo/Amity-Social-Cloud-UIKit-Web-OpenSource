import React, { useCallback, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommentList } from '~/v4/social/components/CommentList';
import { CommentComposer } from '~/v4/social/components/CommentComposer';
import styles from './CommentTray.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

type CommentTrayProps = {
  pageId?: string;
  referenceId: string;
  community: Amity.Community;
  shouldAllowCreation?: boolean;
  shouldAllowInteraction: boolean;
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
  const [replyTo, setReplyTo] = useState<Amity.Comment | undefined>();
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });

  const onCancelReply = useCallback(() => setReplyTo(undefined), []);

  const onClickReply = useCallback(
    (comment: Amity.Comment) =>
      setReplyTo((prevComment) =>
        prevComment?.commentId === comment?.commentId ? undefined : comment,
      ),
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
          renderReplyComment={(comment) => {
            if (replyTo && comment.commentId === replyTo.commentId && isDesktop) {
              return (
                <CommentComposer
                  pageId={pageId}
                  replyTo={replyTo}
                  community={community}
                  referenceId={referenceId}
                  referenceType={referenceType}
                  onCancelReply={onCancelReply}
                  shouldAllowCreation={shouldAllowCreation}
                />
              );
            }
          }}
        />
      </div>
      {shouldAllowInteraction && (
        <CommentComposer
          referenceId={referenceId}
          onCancelReply={onCancelReply}
          referenceType={referenceType}
          replyTo={isDesktop ? undefined : (replyTo as Amity.Comment)}
          shouldAllowCreation={shouldAllowCreation}
          containerClassName={styles.commentTrayContainer__commentComposer}
        />
      )}
    </div>
  );
};
