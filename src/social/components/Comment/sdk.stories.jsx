import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneComment from '~/mock/useOneComment';

import UiKitComment from '.';

export default {
  title: 'SDK Connected/Social/Comment',
};

export const SDKComment = ({ readonly, isReplyComment }) => {
  const [comment, isLoading] = useOneComment();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return (
    <UiKitComment
      commentId={comment.commentId}
      readonly={readonly}
      isReplyComment={isReplyComment}
    />
  );
};

SDKComment.storyName = 'Single Comment';

SDKComment.args = {
  readonly: false,
  isReplyComment: false,
};

SDKComment.argTypes = {
  readonly: { control: { type: 'boolean' } },
  isReplyComment: { control: { type: 'boolean' } },
};

// TODO - make sure that the comment for this story always has replies.
export const SDKCommentWithReplies = () => {
  const [comment, isLoading] = useOneComment();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return <UiKitComment commentId={comment.commentId} />;
};

SDKCommentWithReplies.storyName = 'Comment with replies';
