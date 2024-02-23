import { CommentRepository } from '@amityco/ts-sdk';
import React from 'react';
import { useIntl } from 'react-intl';
import { Mentionees, Metadata } from '~/helpers/utils';
import { Lock2Icon } from '~/icons';
import CommentComposeBar from '~/social/components/CommentComposeBar';
import {
  StoryCommentComposerBarContainer,
  StoryDisabledCommentComposerBarContainer,
} from '~/social/components/StoryViewer/styles';

interface StoryCommentComposeBarProps {
  storyId: string;
  isJoined?: boolean;
  allowCommentInStory?: boolean;
}

const StoryCommentComposeBar = ({
  storyId,
  isJoined,
  allowCommentInStory,
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

  if (isJoined && allowCommentInStory) {
    return (
      <StoryCommentComposerBarContainer>
        <CommentComposeBar
          storyId={storyId}
          onSubmit={(text, mentionees, metadata) => handleAddComment(text, mentionees, metadata)}
        />
      </StoryCommentComposerBarContainer>
    );
  }

  if (isJoined && allowCommentInStory) {
    return (
      <StoryDisabledCommentComposerBarContainer>
        <Lock2Icon /> {formatMessage({ id: 'storyViewer.commentSheet.disabled' })}
      </StoryDisabledCommentComposerBarContainer>
    );
  }

  return null;
};

export default StoryCommentComposeBar;
