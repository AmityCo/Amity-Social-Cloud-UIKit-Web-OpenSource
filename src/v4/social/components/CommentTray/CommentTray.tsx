import React, { useState } from 'react';
import { CommentList } from '~/v4/social/internal-components/CommentList';
import { StoryCommentComposeBar } from '~/v4/social/internal-components/StoryCommentComposeBar';
import styles from './CommentTray.module.css';

const REPLIES_PER_PAGE = 5;

interface CommentTrayProps {
  referenceType: Amity.CommentReferenceType;
  referenceId: string;
  community: Amity.Community;
  shouldAllowInteraction: boolean;
  shouldAllowCreation?: boolean;
}

export const CommentTray = ({
  referenceType,
  referenceId,
  community = {} as Amity.Community,
  shouldAllowInteraction = true,
  shouldAllowCreation = false,
}: CommentTrayProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyTo, setReplyTo] = useState<Amity.Comment | null>(null);

  const onClickReply = (comment: Amity.Comment) => {
    setIsReplying(true);
    setReplyTo(comment);
  };

  const onCancelReply = () => {
    setIsReplying(false);
    setReplyTo(null);
  };

  return (
    <div className={styles.commentTrayContainer}>
      <div className={styles.commentListContainer}>
        <CommentList
          referenceId={referenceId}
          referenceType={referenceType}
          onClickReply={onClickReply}
          shouldAllowInteraction={shouldAllowInteraction}
          limit={REPLIES_PER_PAGE}
          includeDeleted
        />
      </div>
      <div className={styles.mobileSheetComposeBarContainer}>
        <StoryCommentComposeBar
          communityId={community.communityId}
          referenceId={referenceId}
          isReplying={isReplying}
          replyTo={replyTo}
          isJoined={community.isJoined}
          shouldAllowCreation={shouldAllowCreation}
          onCancelReply={onCancelReply}
        />
      </div>
    </div>
  );
};
