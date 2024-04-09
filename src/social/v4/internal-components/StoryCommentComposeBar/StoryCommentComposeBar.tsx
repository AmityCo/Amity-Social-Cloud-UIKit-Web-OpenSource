import { CommentRepository } from '@amityco/ts-sdk';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Mentionees, Metadata } from '~/helpers/utils';
import { Close, Lock2Icon } from '~/icons';

import {
  ReplyingBlock,
  StoryDisabledCommentComposerBarContainer,
} from '~/social/v4/internal-components/StoryViewer/styles';
import { CommentComposeBar } from '~/social/v4/internal-components/CommentComposeBar';

import {
  ReplyingToText,
  ReplyingToUsername,
} from '~/social/v4/internal-components/CommentComposeBar/styles';

interface StoryCommentComposeBarProps {
  communityId: string;
  comment?: Amity.Comment | null;
  isJoined?: boolean;
  isReplying?: boolean;
  allowCommentInStory?: boolean;
  shouldAllowCreation?: boolean;
  replyTo?: string | null;
  onCancelReply?: () => void;
  referenceType?: string;
  referenceId?: string;
  commentId?: string;
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
  commentId,
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
      referenceId: storyId,
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
    if (!referenceType || !referenceId) return;
    await CommentRepository.createComment({
      referenceType: referenceType as Amity.CommentReferenceType,
      referenceId,
      data: {
        text: replyCommentText,
      },
      parentId: commentId,
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
              <ReplyingToUsername>{replyTo}</ReplyingToUsername>
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
            userToReply={replyTo}
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
