/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { customizableComponent } from 'hocs/customization';
import CommentComposeBar from 'components/CommentComposeBar';
import CommentReplies from './CommentReplies';
import StyledComment from './Comment.styles';
import useCommentSdk from './useCommentSdk';
import { CommentBlock, CommentContainer, ReplyContainer } from './styles';

const Comment = ({ commentId, isReplyComment = false }) => {
  const [isReplying, setIsReplying] = useState(false);
  const {
    isCommentReady,
    comment,
    commentAuthor,
    commentReplies,
    handleReportComment,
    handleReplyToComment,
  } = useCommentSdk({ commentId });

  const onClickReply = () => {
    setIsReplying(true);
  };

  if (!isCommentReady) return null;

  if (isReplyComment) {
    return (
      <ReplyContainer>
        <StyledComment
          commentId={comment.commentId}
          authorName={commentAuthor.displayName || commentAuthor.userId}
          authorAvatar={commentAuthor.avatar}
          createdAt={comment.createdAt}
          text={comment.data.text}
          handleReportComment={handleReportComment}
          isReplyComment
        />
      </ReplyContainer>
    );
  }

  return (
    <CommentBlock>
      <CommentContainer>
        <StyledComment
          commentId={comment.commentId}
          authorName={commentAuthor.displayName}
          authorAvatar={commentAuthor.avatar}
          createdAt={comment.createdAt}
          text={comment.data.text}
          onClickReply={onClickReply}
          handleReportComment={handleReportComment}
        />
      </CommentContainer>
      <CommentReplies replyIds={commentReplies} />
      {isReplying && (
        <CommentComposeBar
          userToReply={commentAuthor.displayName}
          onSubmit={handleReplyToComment}
        />
      )}
    </CommentBlock>
  );
};

Comment.propTypes = {
  commentId: PropTypes.string.isRequired,
  isReplyComment: PropTypes.bool,
};

export default customizableComponent('Comment', Comment);
