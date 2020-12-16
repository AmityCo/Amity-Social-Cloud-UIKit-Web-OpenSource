/* eslint-disable import/no-cycle */
import React from 'react';
import Comment from '.';

const CommentReplies = ({ canInteract, replyIds }) =>
  replyIds.map(({ commentId }) => (
    <Comment key={commentId} commentId={commentId} canInteract={canInteract} isReplyComment />
  ));

export default CommentReplies;
