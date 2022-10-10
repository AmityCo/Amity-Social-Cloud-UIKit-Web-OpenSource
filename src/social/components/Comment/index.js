/* eslint-disable import/no-cycle */
import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import withSDK from '~/core/hocs/withSDK';
import { confirm } from '~/core/components/Confirm';
import customizableComponent from '~/core/hocs/customization';
import useComment from '~/social/hooks/useComment';
import CommentComposeBar from '~/social/components/CommentComposeBar';
import CommentList from '~/social/components/CommentList';
import { notification } from '~/core/components/Notification';
import { isModerator } from '~/helpers/permissions';
import StyledComment from './Comment.styles';
import useSocialMention from '~/social/hooks/useSocialMention';
import usePost from '~/social/hooks/usePost';
import { useNavigation } from '~/social/providers/NavigationProvider';

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
import { extractMetadata, parseMentionsMarkup } from '~/helpers/utils';

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

const Comment = ({ readonly = false, commentId, currentUserId, userRoles, handleCopyPath }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { formatMessage } = useIntl();
  const [isExpanded, setExpanded] = useState(false);
  const { onClickUser } = useNavigation();

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

  const { post } = usePost(comment?.referenceId);

  const {
    text: localText,
    markup,
    mentions,
    onChange,
    queryMentionees,
    resetState,
    clearAll,
  } = useSocialMention({
    targetId: post?.targetId,
    targetType: post?.targetType,
    remoteText: comment?.data?.text ?? '',
    remoteMarkup: parseMentionsMarkup(comment?.data?.text, comment?.metadata),
  });

  const onReportClick = async () => {
    try {
      await handleReportComment();
      if (isFlaggedByMe) {
        notification.success({
          content: formatMessage({ id: 'report.unreportSent' }),
        });
      } else {
        notification.success({
          content: formatMessage({ id: 'report.reportSent' }),
        });
      }
    } catch (err) {
      notification.error({
        content: err.message,
      });
    }
  };

  const handleClickUser = () => onClickUser(commentAuthor.userId);

  const onCopyPathClick = () => {
    handleCopyPath(comment);
  };

  const [text, setText] = useState(comment?.data?.text ?? '');

  useEffect(() => {
    if (text !== comment?.data?.text) {
      setText(comment?.data?.text);
    }
  }, [comment?.data?.text, text]);

  const onClickReply = () => {
    setIsReplying((preValue) => !preValue);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    resetState();
  };

  const handleEdit = () => {
    const { metadata, mentionees } = extractMetadata(mentions);
    handleEditComment(localText, mentionees, metadata);

    clearAll();
    setIsEditing(false);
  };

  const isCommentOwner = commentAuthor.userId === currentUserId;
  const isReplyComment = !!comment.parentId;

  const deleteComment = () => {
    const title = isReplyComment ? 'reply.delete' : 'comment.delete';
    const content = isReplyComment ? 'reply.deleteBody' : 'comment.deleteBody';
    confirm({
      title: <FormattedMessage id={title} />,
      content: <FormattedMessage id={content} />,
      cancelText: formatMessage({ id: 'comment.deleteConfirmCancelText' }),
      okText: formatMessage({ id: 'comment.deleteConfirmOkText' }),
      onOk: handleDeleteComment,
    });
  };

  const canDelete = (!readonly && isCommentOwner) || isModerator(userRoles);
  const canEdit = !readonly && isCommentOwner;
  const canLike = !readonly;
  const canReply = !readonly && !isReplyComment;
  const canReport = !readonly && !isCommentOwner;

  if (!isCommentReady) {
    return null;
  }

  if (comment.isDeleted) {
    return isReplyComment ? (
      <DeletedReply />
    ) : (
      <CommentBlock>
        <DeletedComment />
      </CommentBlock>
    );
  }

  const renderedComment = (
    <StyledComment
      commentId={comment.commentId}
      authorName={
        commentAuthor.displayName || commentAuthor.userId || formatMessage({ id: 'anonymous' })
      }
      authorAvatar={commentAuthorAvatar.fileUrl}
      canDelete={canDelete}
      canEdit={canEdit}
      canLike={canLike}
      canReply={canReply}
      canReport={canReport}
      isBanned={commentAuthor.isGlobalBan}
      createdAt={comment.createdAt}
      editedAt={comment.editedAt}
      mentionees={comment?.metadata?.mentioned}
      metadata={comment?.metadata}
      text={text}
      markup={markup}
      handleReportComment={onReportClick}
      startEditing={startEditing}
      cancelEditing={cancelEditing}
      handleEdit={handleEdit}
      handleDelete={deleteComment}
      isEditing={isEditing}
      queryMentionees={queryMentionees}
      isReported={isFlaggedByMe}
      isReplyComment={isReplyComment}
      onClickReply={onClickReply}
      onClickUser={handleClickUser}
      onChange={onChange}
      handleCopyPath={handleCopyPath ? onCopyPathClick : undefined}
    />
  );

  return isReplyComment ? (
    <ReplyContainer>{renderedComment}</ReplyContainer>
  ) : (
    <CommentBlock>
      <CommentContainer data-comment-id={comment.commentId}>{renderedComment}</CommentContainer>
      <CommentList
        parentId={commentId}
        referenceId={comment.referenceId}
        last={REPLIES_PER_PAGE}
        readonly={readonly}
        isExpanded={isExpanded}
      />

      {isReplying && (
        <CommentComposeBar
          postId={comment?.referenceId}
          postType={comment?.referenceType}
          userToReply={commentAuthor.displayName}
          onSubmit={(replyText, mentionees, metadata) => {
            handleReplyToComment(replyText, mentionees, metadata);
            setIsReplying(false);
            setExpanded(true);
          }}
        />
      )}
    </CommentBlock>
  );
};

Comment.propTypes = {
  readonly: PropTypes.bool,
  commentId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  userRoles: PropTypes.array,
  handleCopyPath: PropTypes.func,
};

export default memo(withSDK(customizableComponent('Comment', Comment)));
