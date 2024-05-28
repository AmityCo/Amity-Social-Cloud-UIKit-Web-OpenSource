import { CommentRepository } from '@amityco/ts-sdk';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Mentionees, Metadata } from '~/v4/helpers/utils';
import { Close, Lock2Icon } from '~/icons';
import { CommentComposeBar } from '../CommentComposeBar';
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
  const { formatMessage } = useIntl();

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

  if (isJoined && shouldAllowCreation) {
    return (
      <>
        {isReplying && (
          <div className={styles.replyingBlock}>
            <div className={styles.replyingToText}>
              <FormattedMessage id="storyViewer.commentSheet.replyingTo" />{' '}
              <span className={styles.replyingToUsername}>{replyTo?.userId}</span>
            </div>
            <Close onClick={onCancelReply} className={styles.closeButton} />
          </div>
        )}
        {!isReplying ? (
          <CommentComposeBar
            targetId={communityId}
            onSubmit={(text, mentionees, metadata) => handleAddComment(text, mentionees, metadata)}
          />
        ) : (
          <CommentComposeBar
            targetId={communityId}
            userToReply={replyTo?.userId}
            onSubmit={(replyText, mentionees, metadata) => {
              handleReplyToComment(replyText, mentionees, metadata);
              onCancelReply?.();
            }}
          />
        )}
      </>
    );
  }

  if (isJoined && shouldAllowCreation) {
    return (
      <div className={styles.disabledCommentComposerBarContainer}>
        <Lock2Icon />
        {formatMessage({ id: 'storyViewer.commentSheet.disabled' })}
      </div>
    );
  }

  return null;
};
