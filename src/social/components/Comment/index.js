/* eslint-disable import/no-cycle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import withSDK from '~/core/hocs/withSDK';
import { confirm } from '~/core/components/Confirm';
import customizableComponent from '~/core/hocs/customization';
import useComment from '~/social/hooks/useComment';
import CommentComposeBar from '~/social/components/CommentComposeBar';
import ConditionalRender from '~/core/components/ConditionalRender';
import { notification } from '~/core/components/Notification';
import { isModerator } from '~/helpers/permissions';
import CommentReplies from './CommentReplies';
import StyledComment from './Comment.styles';
import {
  CommentBlock,
  CommentContainer,
  ReplyContainer,
  DeletedCommentContainer,
  DeletedIcon,
  Text,
  IconContainer,
  MessageContainer,
} from './styles';

// TODO: enable replies feature once working on all platforms.
export const ENABLE_REPLIES = false;

// TODO: react-intl
const DEFAULT_DISPLAY_NAME = 'Anonymous';

const DeletedComment = () => {
  return (
    <DeletedCommentContainer>
      <IconContainer>
        <DeletedIcon />
      </IconContainer>
      <MessageContainer>
        <Text>
          <FormattedMessage id="comment.deleted" />
        </Text>
      </MessageContainer>
    </DeletedCommentContainer>
  );
};

const Comment = ({
  canInteract = true,
  commentId,
  isReplyComment = false,
  currentUserId,
  userRoles,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    isCommentReady,
    comment,
    commentAuthor,
    commentAuthorAvatar,
    commentReplies,
    handleReportComment,
    handleReplyToComment,
    handleEditComment,
    handleDeleteComment,
    isFlaggedByMe,
  } = useComment({ commentId });

  const onReportClick = async () => {
    try {
      await handleReportComment();
      if (isFlaggedByMe) {
        notification.success({
          content: <FormattedMessage id="report.unreportSent" />,
        });
      } else {
        notification.success({
          content: <FormattedMessage id="report.reportSent" />,
        });
      }
    } catch (err) {
      notification.error({
        content: err.message,
      });
    }
  };

  const [text, setText] = useState(comment?.data?.text ?? '');

  useEffect(() => {
    if (text !== comment?.data?.text) {
      setText(comment?.data?.text);
    }
  }, [comment?.data?.text]);

  const onClickReply = () => {
    setIsReplying(true);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleEdit = commentText => {
    handleEditComment(commentText);
    cancelEditing();
  };

  const isCommentOwner = commentAuthor.userId === currentUserId;

  const deleteComment = () => {
    // TODO: react-intl
    confirm({
      title: 'Delete comment',
      content: 'This comment will be permanently deleted. Continue?',
      cancelText: 'Cancel',
      okText: 'Delete',
      onOk: handleDeleteComment,
    });
  };

  const canDelete = isCommentOwner || isModerator(userRoles);
  const canEdit = canInteract && isCommentOwner;
  const canLike = canInteract;
  const canReply = canInteract && !isReplyComment && ENABLE_REPLIES;
  const canReport = canInteract && !isCommentOwner;

  const renderedComment = (
    <StyledComment
      commentId={comment.commentId}
      authorName={commentAuthor.displayName || commentAuthor.userId || DEFAULT_DISPLAY_NAME}
      authorAvatar={commentAuthorAvatar.fileUrl}
      canDelete={canDelete}
      canEdit={canEdit}
      canLike={canLike}
      canReply={canReply}
      canReport={canReport}
      createdAt={comment.createdAt}
      updatedAt={comment.updatedAt}
      text={text}
      onClickReply={onClickReply}
      handleReportComment={onReportClick}
      startEditing={startEditing}
      cancelEditing={cancelEditing}
      handleEdit={handleEdit}
      handleDelete={deleteComment}
      isEditing={isEditing}
      setText={setText}
      isReported={isFlaggedByMe}
    />
  );

  return (
    <ConditionalRender condition={isCommentReady}>
      <ConditionalRender condition={comment.isDeleted}>
        <CommentBlock>
          <DeletedComment />
        </CommentBlock>
        <ConditionalRender condition={isReplyComment && ENABLE_REPLIES}>
          <ReplyContainer>{renderedComment}</ReplyContainer>
          <CommentBlock>
            <CommentContainer>{renderedComment}</CommentContainer>

            {ENABLE_REPLIES && (
              <CommentReplies canInteract={canInteract} replyIds={commentReplies} />
            )}

            <ConditionalRender condition={isReplying}>
              <CommentComposeBar
                userToReply={commentAuthor.displayName}
                onSubmit={handleReplyToComment}
              />
            </ConditionalRender>
          </CommentBlock>
        </ConditionalRender>
      </ConditionalRender>
    </ConditionalRender>
  );
};

Comment.propTypes = {
  canInteract: PropTypes.bool,
  commentId: PropTypes.string.isRequired,
  isReplyComment: PropTypes.bool,
  currentUserId: PropTypes.string.isRequired,
  userRoles: PropTypes.array,
};

export default withSDK(customizableComponent('Comment', Comment));
