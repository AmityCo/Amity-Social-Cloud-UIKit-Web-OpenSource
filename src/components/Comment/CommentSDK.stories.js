import React from 'react';
import useOneComment from 'hooks/useOneComment';
import StyledComment from './Comment.styles';
import Comment from '.';

export default {
  title: 'Comment',
};

export const BasicComment = args => {
  const [comment, isLoading] = useOneComment();
  if (isLoading) return <p>Loading...</p>;
  return <StyledComment {...args} commentId={comment.commentId} />;
};

BasicComment.args = {
  authorName: 'Test Author',
  authorAvatar: '',
  createdAt: '9/28/20',
  text: 'Dynamic comment text',
  isReplyComment: false,
};

BasicComment.argTypes = {
  authorName: { control: { type: 'text' } },
  authorAvatar: { control: { type: 'text' } },
  createdAt: { control: { type: 'text' } },
  text: { control: { type: 'text' } },
  isReplyComment: { control: { type: 'boolean' } },
  onClickReply: { action: 'Reply clicked!' },
  handleReportComment: { action: 'Comment reported!' },
};

export const CommentWithSdk = () => {
  const [comment, isLoading] = useOneComment();
  if (isLoading) return <p>Loading...</p>;
  return <Comment commentId={comment.commentId} />;
};

export const ReplyCommentWithSdk = () => {
  const [comment, isLoading] = useOneComment();
  if (isLoading) return <p>Loading...</p>;
  return <Comment commentId={comment.commentId} isReplyComment />;
};

// TODO - make sure that the comment for this story always has replies.
export const CommentWithRepliesSdk = () => {
  const [comment, isLoading] = useOneComment();
  if (isLoading) return <p>Loading...</p>;
  return <Comment commentId={comment.commentId} />;
};
