import React, { memo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import useComment from '~/social/hooks/useComment';

import { notification } from '~/core/components/Notification';
import useMention from '~/v4/chat/hooks/useMention';

import {
  CommentBlock,
  CommentContainer,
  DeletedCommentContainer,
  DeletedIcon,
  DeletedReplyContainer,
  IconContainer,
  MessageContainer,
  MobileSheet,
  MobileSheetButton,
  MobileSheetContent,
  MobileSheetHeader,
  MobileSheetNestedBackDrop,
  ReplyContainer,
  Text,
} from './styles';
import {
  extractMetadata,
  isNonNullable,
  Mentioned,
  Mentionees,
  Metadata,
  parseMentionsMarkup,
} from '~/v4/helpers/utils';
import { LoadingIndicator } from '~/core/components/ProgressBar/styles';
import useSDK from '~/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';
import { CommentRepository, ReactionRepository } from '@amityco/ts-sdk';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useCommentFlaggedByMe from '~/social/hooks/useCommentFlaggedByMe';
import useCommentPermission from '~/social/hooks/useCommentPermission';
import useCommentSubscription from '~/social/hooks/useCommentSubscription';

import useImage from '~/core/hooks/useImage';

import { FlagIcon, Pencil2Icon, Trash2Icon } from '~/icons';
import UIComment from './UIComment';

import { LIKE_REACTION_KEY } from '~/constants';
import { CommentList } from '~/v4/social/internal-components/CommentList';
import { ReactionList } from '~/v4/social/components/ReactionList';
import { useTheme } from 'styled-components';
import useGetStoryByStoryId from '../../hooks/useGetStoryByStoryId';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

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
  onClickReply?: (
    replyTo: string | undefined,
    referenceType: Amity.Comment['referenceType'],
    referenceId: Amity.Comment['referenceId'],
    commentId: Amity.Comment['commentId'],
  ) => void;
  style?: React.CSSProperties;
  onClickReactionList: (commentId: string) => void;
  shouldAllowInteraction?: boolean;
}

const Comment = ({
  commentId,
  readonly,
  onClickReply,
  style,
  shouldAllowInteraction,
}: CommentProps) => {
  const theme = useTheme();
  const comment = useComment(commentId);
  const story = useGetStoryByStoryId(comment?.referenceId);
  const [bottomSheet, setBottomSheet] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState('');
  const { confirm } = useConfirmContext();

  const commentAuthor = useUser(comment?.userId);
  const commentAuthorAvatar = useImage({ fileId: commentAuthor?.avatarFileId, imageSize: 'small' });
  const { userRoles } = useSDK();
  const { toggleFlagComment, isFlaggedByMe } = useCommentFlaggedByMe(commentId);

  const [isEditing, setIsEditing] = useState(false);
  const { formatMessage } = useIntl();
  const [isExpanded, setExpanded] = useState(false);

  const toggleBottomSheet = () => setBottomSheet((prev) => !prev);

  useCommentSubscription({
    commentId,
  });

  const { text, markup, mentions, onChange, queryMentionees, resetState, clearAll } = useMention({
    targetId: story?.targetId,
    targetType: story?.targetType,
    remoteText: getCommentData(comment),
    remoteMarkup: parseMentionsMarkup(getCommentData(comment), comment?.metadata || {}),
  });

  const { canDelete, canEdit, canLike, canReply, canReport } = useCommentPermission(
    comment,
    readonly,
    userRoles,
  );

  if (story == null && comment == null) return <LoadingIndicator />;

  const handleReportComment = async () => {
    return toggleFlagComment();
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
      if (err instanceof Error) {
        notification.error({
          content: err.message,
        });
      }
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    toggleBottomSheet();
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

  const isLiked = !!comment?.myReactions?.includes(LIKE_REACTION_KEY);

  const handleLike = async () => {
    if (!comment) return;

    if (!isLiked) {
      await ReactionRepository.addReaction('comment', comment?.commentId, LIKE_REACTION_KEY);
    } else {
      await ReactionRepository.removeReaction('comment', comment?.commentId, LIKE_REACTION_KEY);
    }
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

  const options = [
    canEdit
      ? {
          name: isReplyComment
            ? formatMessage({ id: 'reply.edit' })
            : formatMessage({ id: 'comment.edit' }),
          action: startEditing,
          icon: <Pencil2Icon width={24} height={24} fill={theme.palette.base.default} />,
        }
      : null,
    canReport
      ? {
          name: isFlaggedByMe
            ? formatMessage({ id: 'report.undoReport' })
            : formatMessage({ id: 'report.doReport' }),
          action: handleReportComment,
          icon: <FlagIcon width={24} height={24} fill={theme.palette.base.default} />,
        }
      : null,
    canDelete
      ? {
          name: isReplyComment
            ? formatMessage({ id: 'reply.delete' })
            : formatMessage({ id: 'comment.delete' }),
          action: deleteComment,
          icon: <Trash2Icon width={24} height={24} fill={theme.palette.base.default} />,
        }
      : null,
  ].filter(isNonNullable);

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
    <UIComment
      commentId={comment?.commentId}
      authorName={
        commentAuthor?.displayName || commentAuthor?.userId || formatMessage({ id: 'anonymous' })
      }
      authorAvatar={commentAuthorAvatar}
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
      reactions={comment?.reactions}
      reactionsCount={comment?.reactionsCount}
      text={text}
      markup={markup}
      handleReportComment={onReportClick}
      startEditing={startEditing}
      cancelEditing={cancelEditing}
      handleEdit={handleEdit}
      handleLike={handleLike}
      handleDelete={deleteComment}
      isEditing={isEditing}
      queryMentionees={queryMentionees}
      isLiked={isLiked}
      isReported={isFlaggedByMe}
      isReplyComment={isReplyComment}
      onChange={onChange}
      onClickOverflowMenu={toggleBottomSheet}
      options={options}
      onClickReply={() =>
        onClickReply?.(
          commentAuthor?.displayName,
          comment.referenceType,
          comment.referenceId,
          comment.commentId,
        )
      }
      onClickReactionList={() => {
        setSelectedCommentId(comment.commentId);
      }}
    />
  );

  return (
    <>
      {isReplyComment ? (
        <ReplyContainer data-qa-anchor="reply">{renderedComment}</ReplyContainer>
      ) : (
        <CommentBlock style={style}>
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
        </CommentBlock>
      )}
      <MobileSheet
        isOpen={bottomSheet}
        onClose={toggleBottomSheet}
        mountPoint={document.getElementById('asc-uikit-stories-viewer') as HTMLElement}
        detent="content-height"
      >
        <MobileSheet.Container>
          <MobileSheetHeader />
          <MobileSheetContent>
            {options.map((bottomSheetAction) => (
              <MobileSheetButton
                onClick={() => {
                  bottomSheetAction.action();
                  setBottomSheet(false);
                }}
              >
                {bottomSheetAction?.icon}
                {bottomSheetAction.name}
              </MobileSheetButton>
            ))}
          </MobileSheetContent>
        </MobileSheet.Container>
        <MobileSheetNestedBackDrop onTap={toggleBottomSheet} />
      </MobileSheet>
      <MobileSheet
        isOpen={!!selectedCommentId}
        onClose={() => setSelectedCommentId('')}
        mountPoint={document.getElementById('asc-uikit-stories-viewer') as HTMLElement}
        detent="full-height"
      >
        <MobileSheet.Container>
          <MobileSheetHeader />
          <MobileSheetContent>
            <MobileSheet.Scroller>
              <ReactionList referenceId={comment.commentId} referenceType="comment" />
            </MobileSheet.Scroller>
          </MobileSheetContent>
        </MobileSheet.Container>
        <MobileSheetNestedBackDrop onTap={() => setSelectedCommentId('')} />
      </MobileSheet>
    </>
  );
};

export default memo((props: CommentProps) => {
  const CustomComponentFn = useCustomComponent<CommentProps>('Comment');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Comment {...props} />;
});
