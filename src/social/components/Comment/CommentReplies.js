/* eslint-disable import/no-cycle */
import React from 'react';
import Comment from '.';

const CommentReplies = ({ isReadOnly, replyIds }) =>
  replyIds.map(({ commentId }) => (
    <Comment key={commentId} commentId={commentId} isReadOnly={isReadOnly} isReplyComment />
  ));

export default CommentReplies;
