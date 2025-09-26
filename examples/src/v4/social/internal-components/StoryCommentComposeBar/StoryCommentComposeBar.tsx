import { CommentRepository } from '@amityco/ts-sdk';
import React from 'react';
import { Mentionees, Metadata } from '~/v4/helpers/utils';
import { Close, Lock2Icon } from '~/icons';
import { CommentComposeBar } from '~/v4/social/internal-components/CommentComposeBar';
import styles from './StoryCommentComposeBar.module.css';

interface StoryCommentComposeBarProps {
  communityId: string;
  comment?: Amity.Comment | null;
  isJoined?: boolean;
  isReplying?: boolean;
  shouldAllowCreation?: boolean;
  replyTo?: Amity.Comment | null;
  onCancelReply?: () => void;
  referenceId?: string;
  style?: React.CSSProperties;
}

export const StoryCommentComposeBar = ({
  communityId,
  isJoined,
  shouldAllowCreation,
  isReplying,
  replyTo,
  onCancelReply,
  referenceId,
}: StoryCommentComposeBarProps) => {
  const handleAddComment = async (
    commentText: string,
    mentionees: Mentionees,
    metadata: Metadata,
  ) => {
    await CommentRepository.createComment({
      referenceType: 'story',
      referenceId: referenceId as string,
      data: {
        text: commentText,
      },
      mentionees: mentionees as Amity.UserMention[],
      metadata,
    });
  };

  const handleReplyToComment = async (
    replyCommentText: string,
    mentionees: Mentionees,
    metadata: Metadata,
  ) => {
    await CommentRepository.createComment({
      referenceType: replyTo?.referenceType as Amity.CommentReferenceType,
      referenceId: replyTo?.referenceId as string,
      data: { text: replyCommentText },
      parentId: replyTo?.commentId,
      metadata,
      mentionees: mentionees as Amity.UserMention[],
    });
  };

  if (!isJoined) {
    return null;
  }

  if (!shouldAllowCreation) {
    return (
      <div className={styles.disabledCommentComposerBarContainer}>
        <Lock2Icon />
        Comments are disabled for this story
      </div>
    );
  }

  return (
    <>
      {isReplying && (
        <div className={styles.replyingBlock}>
          <div className={styles.replyingToText}>
            {'Replying to '}
            <span className={styles.replyingToUsername}>{replyTo?.userId}</span>
          </div>
          <Close onClick={onCancelReply} className={styles.closeButton} />
        </div>
      )}
      {!isReplying ? (
        <CommentComposeBar
          targetType="story"
          targetId={communityId}
          onSubmit={(text, mentionees, metadata) => handleAddComment(text, mentionees, metadata)}
        />
      ) : (
        <CommentComposeBar
          targetId={communityId}
          targetType="story"
          userToReply={replyTo?.userId}
          onSubmit={(replyText, mentionees, metadata) => {
            handleReplyToComment(replyText, mentionees, metadata);
            onCancelReply?.();
          }}
        />
      )}
    </>
  );
};
