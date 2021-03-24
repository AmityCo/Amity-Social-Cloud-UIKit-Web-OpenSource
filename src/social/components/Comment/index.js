/* eslint-disable import/no-cycle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import withSDK from '~/core/hocs/withSDK';
import { confirm } from '~/core/components/Confirm';
import customizableComponent from '~/core/hocs/customization';
import useComment from '~/social/hooks/useComment';
import CommentComposeBar from '~/social/components/CommentComposeBar';
import CommentList from '~/social/components/CommentList';
import ConditionalRender from '~/core/components/ConditionalRender';
import { notification } from '~/core/components/Notification';
import { isModerator } from '~/helpers/permissions';
import StyledComment from './Comment.styles';
import {
  CommentBlock,
  CommentContainer,
  ReplyContainer,
  DeletedCommentContainer,
  DeletedReplyContainer,
  DeletedIcon,
  Text,
  IconContainer,
  MessageContainer,
} from './styles';

// TODO: react-intl
const DEFAULT_DISPLAY_NAME = 'Anonymous';

const REPLIES_PER_PAGE = 5;

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

const DeletedReply = () => {
  return (
    <div>
      <DeletedReplyContainer>
        <IconContainer className="reply">
          <DeletedIcon />
        </IconContainer>
        <MessageContainer>
          <Text>
            <FormattedMessage id="reply.deleted" />
          </Text>
        </MessageContainer>
      </DeletedReplyContainer>
    </div>
  );
};

const Comment = ({ readonly = false, commentId, currentUserId, userRoles }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    isCommentReady,
    comment,
    commentAuthor,
    commentAuthorAvatar,
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
  const [oldText, setOldText] = useState(comment?.data?.text ?? '');

  useEffect(() => {
    if (text !== comment?.data?.text) {
      setText(comment?.data?.text);
    }
  }, [comment?.data?.text]);

  const onClickReply = () => {
    setIsReplying(preValue => !preValue);
  };

  const startEditing = () => {
    setIsEditing(true);
    setOldText(text);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setText(oldText);
  };

  const handleEdit = commentText => {
    handleEditComment(commentText);
    cancelEditing();
  };

  const isCommentOwner = commentAuthor.userId === currentUserId;
  const isReplyComment = !!comment.parentId;

  const deleteComment = () => {
    const title = isReplyComment ? 'reply.delete' : 'comment.delete';
    const content = isReplyComment ? 'reply.deleteBody' : 'comment.deleteBody';
    confirm({
      title: <FormattedMessage id={title} />,
      content: <FormattedMessage id={content} />,
      cancelText: 'Cancel',
      okText: 'Delete',
      onOk: handleDeleteComment,
    });
  };

  const canDelete = (!readonly && isCommentOwner) || isModerator(userRoles);
  const canEdit = !readonly && isCommentOwner;
  const canLike = !readonly;
  const canReply = !readonly && !isReplyComment;
  const canReport = !readonly && !isCommentOwner;

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
      editedAt={comment.editedAt}
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
      isReplyComment={isReplyComment}
    />
  );

  return (
    <ConditionalRender condition={isCommentReady}>
      <ConditionalRender condition={comment.isDeleted}>
        <ConditionalRender condition={!isReplyComment}>
          <CommentBlock>
            <DeletedComment />
          </CommentBlock>
          <DeletedReply />
        </ConditionalRender>
        <ConditionalRender condition={isReplyComment}>
          <ReplyContainer>{renderedComment}</ReplyContainer>
          <CommentBlock>
            <CommentContainer>{renderedComment}</CommentContainer>
            <CommentList
              parentId={commentId}
              referenceId={comment.referenceId}
              last={REPLIES_PER_PAGE}
              readonly={readonly}
              isExpanded={false}
            />

            <ConditionalRender condition={isReplying}>
              <CommentComposeBar
                userToReply={commentAuthor.displayName}
                onSubmit={replyText => {
                  handleReplyToComment(replyText);
                  setIsReplying(false);
                }}
              />
            </ConditionalRender>
          </CommentBlock>
        </ConditionalRender>
      </ConditionalRender>
    </ConditionalRender>
  );
};

Comment.propTypes = {
  readonly: PropTypes.bool,
  commentId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  userRoles: PropTypes.array,
};

export default withSDK(customizableComponent('Comment', Comment));
