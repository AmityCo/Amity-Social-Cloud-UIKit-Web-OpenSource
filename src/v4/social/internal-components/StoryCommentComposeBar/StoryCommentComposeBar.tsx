import { CommentRepository } from '@amityco/ts-sdk';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Mentionees, Metadata } from '~/v4/helpers/utils';
import { Close, Lock2Icon } from '~/icons';
import { ReplyingBlock } from '../StoryViewer/styles';
import { ReplyingToText, ReplyingToUsername } from '../CommentComposeBar/styles';
import { CommentComposeBar } from '../CommentComposeBar';
import { StoryDisabledCommentComposerBarContainer } from './styles';

interface StoryCommentComposeBarProps {
  communityId: string;
  comment?: Amity.Comment | null;
  isJoined?: boolean;
  isReplying?: boolean;
  shouldAllowCreation?: boolean;
  replyTo?: Amity.Comment | null;
  onCancelReply?: () => void;
  referenceType?: string;
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
  referenceType,
  referenceId,
  style,
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
      mentionees,
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
      data: {
        text: replyCommentText,
      },
      parentId: replyTo?.commentId,
      metadata,
      mentionees,
    });
  };

  if (isJoined && shouldAllowCreation) {
    return (
      <>
        {isReplying && (
          <ReplyingBlock>
            <ReplyingToText>
              <FormattedMessage id="storyViewer.commentSheet.replyingTo" />{' '}
              <ReplyingToUsername>{replyTo?.userId}</ReplyingToUsername>
            </ReplyingToText>
            <Close width={20} height={20} onClick={onCancelReply} />
          </ReplyingBlock>
        )}

        {!isReplying ? (
          <CommentComposeBar
            targetId={communityId}
            onSubmit={(text, mentionees, metadata) => handleAddComment(text, mentionees, metadata)}
            style={style}
          />
        ) : (
          <CommentComposeBar
            targetId={communityId}
            userToReply={replyTo?.userId}
            onSubmit={(replyText, mentionees, metadata) => {
              handleReplyToComment(replyText, mentionees, metadata);
              onCancelReply?.();
            }}
            style={style}
          />
        )}
      </>
    );
  }

  if (isJoined && shouldAllowCreation) {
    return (
      <StoryDisabledCommentComposerBarContainer>
        <Lock2Icon /> {formatMessage({ id: 'storyViewer.commentSheet.disabled' })}
      </StoryDisabledCommentComposerBarContainer>
    );
  }

  return null;
};
