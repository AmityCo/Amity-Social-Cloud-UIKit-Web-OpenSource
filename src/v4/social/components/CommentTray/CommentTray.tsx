import React, { useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommentComposer } from '~/v4/social/components/CommentComposer';
import { CommentList } from '~/v4/social/components/CommentList';

import styles from './CommentTray.module.css';

interface CommentTrayProps {
  referenceType: Amity.CommentReferenceType;
  referenceId: string;
  community: Amity.Community;
  shouldAllowInteraction: boolean;
  shouldAllowCreation?: boolean;
  pageId?: string;
}

export const CommentTray = ({
  pageId = '*',
  referenceType,
  referenceId,
  community = {} as Amity.Community,
  shouldAllowInteraction = true,
  shouldAllowCreation = true,
}: CommentTrayProps) => {
  const componentId = 'comment_tray_component';
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const [replyTo, setReplyTo] = useState<Amity.Comment | null>(null);

  const onClickReply = (comment: Amity.Comment) => {
    setReplyTo(comment);
  };

  const onCancelReply = () => {
    setReplyTo(null);
  };

  return (
    <div
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.commentTrayContainer}
    >
      <div className={styles.commentListContainer}>
        <CommentList
          referenceId={referenceId}
          referenceType={referenceType}
          community={community}
          includeDeleted
          onClickReply={onClickReply}
          shouldAllowInteraction={shouldAllowInteraction}
        />
      </div>
      <CommentComposer
        referenceId={referenceId}
        referenceType={referenceType}
        onCancelReply={onCancelReply}
        replyTo={replyTo as Amity.Comment}
        shouldAllowCreation={shouldAllowCreation}
      />
    </div>
  );
};
