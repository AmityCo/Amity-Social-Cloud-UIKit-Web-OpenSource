/* eslint-disable import/no-cycle */
import React from 'react';
import Comment from '.';

const CommentReplies = ({ replyIds }) =>
  replyIds.map(({ commentId }) => <Comment key={commentId} commentId={commentId} isReplyComment />);

export default CommentReplies;
