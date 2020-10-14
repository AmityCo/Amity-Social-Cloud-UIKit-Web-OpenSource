/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { customizableComponent } from '~/core/hocs/customization';
import useComment from '~/social/hooks/useComment';
import CommentComposeBar from '~/social/components/CommentComposeBar';
import { ConditionalRender } from '~/core/components/ConditionalRender';
import CommentReplies from './CommentReplies';
import StyledComment from './Comment.styles';
import { CommentBlock, CommentContainer, ReplyContainer } from './styles';

// TODO: react-intl
const DEFAULT_DISPLAY_NAME = 'Anonymous';

const Comment = ({ commentId, isReplyComment = false }) => {
  const [isReplying, setIsReplying] = useState(false);
  const {
    isCommentReady,
    comment,
    commentAuthor,
    commentReplies,
    handleReportComment,
    handleReplyToComment,
  } = useComment({ commentId });

  const onClickReply = () => {
    setIsReplying(true);
  };

  return (
    <ConditionalRender condition={isCommentReady}>
      <ConditionalRender condition={isReplyComment}>
        <ReplyContainer>
          <StyledComment
            commentId={comment.commentId}
            authorName={commentAuthor.displayName || commentAuthor.userId || DEFAULT_DISPLAY_NAME}
            authorAvatar={commentAuthor.avatar}
            createdAt={comment.createdAt}
            text={comment?.data?.text ?? ''}
            handleReportComment={handleReportComment}
            isReplyComment
          />
        </ReplyContainer>
        <CommentBlock>
          <CommentContainer>
            <StyledComment
              commentId={comment.commentId}
              authorName={commentAuthor.displayName || DEFAULT_DISPLAY_NAME}
              authorAvatar={commentAuthor.avatar}
              createdAt={comment.createdAt}
              text={comment?.data?.text ?? ''}
              onClickReply={onClickReply}
              handleReportComment={handleReportComment}
            />
          </CommentContainer>
          <CommentReplies replyIds={commentReplies} />
          <ConditionalRender condition={isReplying}>
            <CommentComposeBar
              userToReply={commentAuthor.displayName}
              onSubmit={handleReplyToComment}
            />
          </ConditionalRender>
        </CommentBlock>
      </ConditionalRender>
    </ConditionalRender>
  );
};

Comment.propTypes = {
  commentId: PropTypes.string.isRequired,
  isReplyComment: PropTypes.bool,
};

export default customizableComponent('Comment', Comment);
