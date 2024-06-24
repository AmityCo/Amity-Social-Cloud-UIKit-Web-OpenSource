import React, { memo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import useComment from '~/social/hooks/useComment';
import CommentComposeBar from '~/social/components/CommentComposeBar';
import CommentList from '~/social/components/CommentList';
import StyledComment from './StyledComment';
import useSocialMention from '~/social/hooks/useSocialMention';
import usePost from '~/social/hooks/usePost';

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
import {
  Mentioned,
  Mentionees,
  Metadata,
  extractMetadata,
  parseMentionsMarkup,
} from '~/helpers/utils';
import { LoadingIndicator } from '~/core/components/ProgressBar/styles';
import useSDK from '~/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';
import useFile from '~/core/hooks/useFile';
import { CommentRepository } from '@amityco/ts-sdk';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useCommentPermission from '~/social/hooks/useCommentPermission';
import useCommentSubscription from '~/social/hooks/useCommentSubscription';

import { ERROR_RESPONSE } from '~/social/constants';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';
import { useNotifications } from '~/core/providers/NotificationProvider';

const REPLIES_PER_PAGE = 5;

const DeletedComment = () => {
  return (
    <DeletedCommentContainer data-qa-anchor="comment-deleted-comment">
      <IconContainer>
        <DeletedIcon />
      </IconContainer>
      <MessageContainer>
        <Text data-qa-anchor="comment-deleted-comment-text">
          <FormattedMessage id="comment.deleted" />
        </Text>
      </MessageContainer>
    </DeletedCommentContainer>
  );
};

const DeletedReply = () => {
  return (
    <div>
      <DeletedReplyContainer data-qa-anchor="reply-deleted-reply">
        <IconContainer className="reply">
          <DeletedIcon />
        </IconContainer>
        <MessageContainer>
          <Text data-qa-anchor="reply-deleted-reply-text">
            <FormattedMessage id="reply.deleted" />
          </Text>
        </MessageContainer>
      </DeletedReplyContainer>
    </div>
  );
};

function getCommentData(comment: Amity.Comment | null) {
  if (comment == null) return '';
  if (typeof comment.data === 'string') return comment.data;

  return (comment?.data as Amity.ContentDataText)?.text || '';
}

interface CommentProps {
  commentId: string;
  readonly?: boolean;
  userRoles?: string[];
}

const Comment = ({ commentId, readonly }: CommentProps) => {
  const comment = useComment(commentId);
  const post = usePost(comment?.referenceId);
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  const commentAuthor = useUser(comment?.userId);
  const commentAuthorAvatar = useFile(commentAuthor?.avatarFileId);
  const { userRoles } = useSDK();

  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { formatMessage } = useIntl();
  const [isExpanded, setExpanded] = useState(false);

  useCommentSubscription({
    commentId,
  });

  const { text, markup, mentions, onChange, queryMentionees, resetState, clearAll } =
    useSocialMention({
      targetId: post?.targetId,
      targetType: post?.targetType,
      remoteText: getCommentData(comment),
      remoteMarkup: parseMentionsMarkup(getCommentData(comment), comment?.metadata || {}),
    });

  // const [text, setText] = useState((comment?.data as Amity.ContentDataText)?.text || '');

  const { canDelete, canEdit, canLike, canReply, canReport } = useCommentPermission(
    comment,
    readonly,
    userRoles,
  );

  // useEffect(() => {
  //   if (text !== (comment?.data as Amity.ContentDataText)?.text) {
  //     setText((comment?.data as Amity.ContentDataText)?.text || '');
  //   }
  // }, [(comment?.data as Amity.ContentDataText)?.text, text]);

  if (post == null && comment == null) return <LoadingIndicator />;

  const handleReplyToComment = async (
    replyCommentText: string,
    mentionees: Mentionees,
    metadata: Metadata,
  ) => {
    if (!comment?.referenceType || !comment?.referenceId) return;

    try {
      const { referenceType, referenceId } = comment;

      await CommentRepository.createComment({
        referenceType,
        referenceId,
        data: {
          text: replyCommentText,
        },
        parentId: commentId,
        metadata,
        mentionees,
      });
      setIsReplying(false);
      setExpanded(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === ERROR_RESPONSE.CONTAIN_BLOCKED_WORD) {
          notification.error({
            content: <FormattedMessage id="notification.error.blockedWord" />,
          });
        }
      }
    }
  };

  const handleEditComment = async (text: string, mentionees: Mentionees, metadata: Metadata) =>
    commentId &&
    CommentRepository.updateComment(commentId, {
      data: {
        text,
      },
      metadata,
      mentionees,
    });

  const handleDeleteComment = async () => commentId && CommentRepository.deleteComment(commentId);

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
    handleEditComment(text, mentionees, metadata);

    clearAll();
    setIsEditing(false);
  };

  const isReplyComment = !!comment?.parentId;

  const deleteComment = () => {
    const title = isReplyComment ? 'reply.delete' : 'comment.delete';
    const content = isReplyComment ? 'reply.deleteBody' : 'comment.deleteBody';
    confirm({
      'data-qa-anchor': 'delete-comment',
      title: <FormattedMessage id={title} />,
      content: <FormattedMessage id={content} />,
      cancelText: formatMessage({ id: 'comment.deleteConfirmCancelText' }),
      okText: formatMessage({ id: 'comment.deleteConfirmOkText' }),
      onOk: handleDeleteComment,
    });
  };

  if (comment == null) return null;

  if (comment?.isDeleted) {
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
      commentId={comment?.commentId}
      authorName={
        commentAuthor?.displayName || commentAuthor?.userId || formatMessage({ id: 'anonymous' })
      }
      authorAvatar={commentAuthorAvatar?.fileUrl}
      canDelete={canDelete}
      canEdit={canEdit}
      canLike={canLike}
      canReply={canReply}
      canReport={canReport}
      isBanned={commentAuthor?.isGlobalBanned}
      createdAt={comment?.createdAt ? new Date(comment.createdAt) : undefined}
      editedAt={comment?.editedAt ? new Date(comment?.editedAt) : undefined}
      mentionees={comment?.metadata?.mentioned as Mentioned[]}
      metadata={comment?.metadata}
      text={text}
      markup={markup}
      startEditing={startEditing}
      cancelEditing={cancelEditing}
      handleEdit={handleEdit}
      handleDelete={deleteComment}
      isEditing={isEditing}
      queryMentionees={queryMentionees}
      isReplyComment={isReplyComment}
      onClickReply={onClickReply}
      onChange={onChange}
    />
  );

  return isReplyComment ? (
    <ReplyContainer data-qa-anchor="reply">{renderedComment}</ReplyContainer>
  ) : (
    <CommentBlock>
      <CommentContainer data-qa-anchor="comment">{renderedComment}</CommentContainer>
      {comment.children.length > 0 && (
        <CommentList
          parentId={comment.commentId}
          referenceType={comment.referenceType}
          referenceId={comment.referenceId}
          readonly={readonly}
          isExpanded={isExpanded}
          limit={REPLIES_PER_PAGE}
        />
      )}

      {isReplying && (
        <CommentComposeBar
          postId={post?.postId}
          userToReply={commentAuthor?.displayName}
          onSubmit={(replyText, mentionees, metadata) => {
            handleReplyToComment(replyText, mentionees, metadata);
          }}
        />
      )}
    </CommentBlock>
  );
};

export default memo((props: CommentProps) => {
  const CustomComponentFn = useCustomComponent<CommentProps>('Comment');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Comment {...props} />;
});
