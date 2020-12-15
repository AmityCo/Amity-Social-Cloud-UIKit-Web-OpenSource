import React from 'react';

import useOneComment from '~/mock/useOneComment';

import UiKitComment from '.';

export default {
  title: 'SDK Connected/Social/Comment',
};

export const SDKComment = ({ isReadOnly, isReplyComment }) => {
  const [comment, isLoading] = useOneComment();
  if (isLoading) return <p>Loading...</p>;
  return (
    <UiKitComment
      commentId={comment.commentId}
      isReadOnly={isReadOnly}
      isReplyComment={isReplyComment}
    />
  );
};

SDKComment.storyName = 'Single Comment';

SDKComment.args = {
  isReadOnly: false,
  isReplyComment: false,
};

SDKComment.argTypes = {
  isReadOnly: { control: { type: 'boolean' } },
  isReplyComment: { control: { type: 'boolean' } },
};

// TODO - make sure that the comment for this story always has replies.
export const SDKCommentWithReplies = () => {
  const [comment, isLoading] = useOneComment();
  if (isLoading) return <p>Loading...</p>;
  return <UiKitComment commentId={comment.commentId} />;
};

SDKCommentWithReplies.storyName = 'Comment with replies';
