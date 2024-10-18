import React, { useState } from 'react';
import useComment from '~/social/hooks/useComment';
import useMention from '~/v4/chat/hooks/useMention';
import {
  extractMetadata,
  isCommunityMember,
  isNonNullable,
  Mentioned,
  Mentionees,
  Metadata,
  parseMentionsMarkup,
} from '~/v4/helpers/utils';
import { CommentRepository, ReactionRepository } from '@amityco/ts-sdk';
import useCommentPermission from '~/social/hooks/useCommentPermission';
import UIComment from './UIComment';
import { LIKE_REACTION_KEY } from '~/constants';
import { CommentList } from '~/v4/social/internal-components/CommentList';
import { ReactionList } from '~/v4/social/components/ReactionList';
import useGetStoryByStoryId from '~/v4/social/hooks/useGetStoryByStoryId';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { Button, BottomSheet, Typography } from '~/v4/core/components';
import { TrashIcon, PenIcon, FlagIcon } from '~/v4/social/icons';
import { LoadingIndicator } from '~/v4/social/internal-components/LoadingIndicator';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import { useCommentFlaggedByMe } from '~/v4/social/hooks';

import { useImage } from '~/v4/core/hooks/useImage';
import useSDK from '~/v4/core/hooks/useSDK';

import styles from './Comment.module.css';
import { isModerator } from '~/v4/utils/permissions';

const REPLIES_PER_PAGE = 5;

function getCommentData(comment: Amity.Comment | null) {
  if (comment == null) return '';
  if (typeof comment.data === 'string') return comment.data;

  return (comment?.data as Amity.ContentDataText)?.text || '';
}

interface CommentProps {
  pageId?: string;
  componentId: string;
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
  shouldAllowInteraction?: boolean;
}

export const Comment = ({
  pageId = '*',
  componentId = '*',
  commentId,
  readonly,
  onClickReply,
}: CommentProps) => {
  const comment = useComment(commentId);

  const { item: story } = useGetStoryByStoryId(comment?.referenceId);
  const { members } = useCommunityMembersCollection({
    queryParams: {
      communityId: story?.community?.communityId as string,
      limit: 10,
    },
    shouldCall: !!story?.community?.communityId,
  });

  const [bottomSheet, setBottomSheet] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState('');
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  const commentAuthor = members?.find((member) => member.userId === comment?.userId);
  const commentAuthorAvatar = useImage({
    fileId: commentAuthor?.user?.avatarFileId,
    imageSize: 'small',
  });

  const { userRoles } = useSDK();
  const { toggleFlagComment, isFlaggedByMe } = useCommentFlaggedByMe(commentId);

  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  const toggleBottomSheet = () => setBottomSheet((prev) => !prev);

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
      mentionees: mentionees as Amity.UserMention[],
    });

  const handleDeleteComment = async () => commentId && CommentRepository.deleteComment(commentId);

  const onReportClick = async () => {
    try {
      await handleReportComment();
      if (isFlaggedByMe) {
        notification.success({
          content: 'Unreport sent',
        });
      } else {
        notification.success({
          content: 'Report sent',
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
    const title = isReplyComment ? 'Delete reply' : 'Delete comment';
    const content = isReplyComment
      ? 'This reply will be permanently deleted. Continue?'
      : 'This comment will be permanently removed.';
    confirm({
      pageId,
      componentId,
      title,
      content,
      cancelText: 'Cancel',
      okText: 'Delete',
      onOk: handleDeleteComment,
    });
  };

  const isCommunityModerator = isModerator(commentAuthor?.roles);
  const isMember = isCommunityMember(commentAuthor);

  const options = [
    canEdit
      ? {
          name: isReplyComment ? 'Edit reply' : 'Edit comment',
          action: startEditing,
          icon: <PenIcon className={styles.actionIcon} />,
        }
      : null,
    canReport
      ? {
          name: isFlaggedByMe ? 'Undo Report' : 'Report',
          action: handleReportComment,
          icon: <FlagIcon className={styles.actionIcon} />,
        }
      : null,
    canDelete
      ? {
          name: isReplyComment ? 'Delete reply' : 'Delete comment',
          action: deleteComment,
          icon: <TrashIcon className={styles.actionIcon} />,
        }
      : null,
  ].filter(isNonNullable);

  if (comment == null) return null;

  const renderedComment = (
    <UIComment
      commentId={comment?.commentId}
      authorName={commentAuthor?.user?.displayName || commentAuthor?.userId || 'Anonymous'}
      authorAvatar={commentAuthorAvatar}
      canDelete={canDelete}
      canEdit={canEdit}
      canLike={canLike}
      canReply={canReply}
      canReport={canReport}
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
      isMember={isMember}
      onChange={onChange}
      onClickOverflowMenu={toggleBottomSheet}
      options={options}
      onClickReply={() =>
        onClickReply?.(
          commentAuthor?.user?.displayName,
          comment.referenceType,
          comment.referenceId,
          comment.commentId,
        )
      }
      onClickReactionList={() => {
        setSelectedCommentId(comment.commentId);
      }}
      isModerator={isCommunityModerator}
    />
  );

  return (
    <>
      {isReplyComment ? (
        <div className={styles.replyContainer} data-qa-anchor="reply">
          {renderedComment}
        </div>
      ) : (
        <div>
          <div data-qa-anchor="comment">{renderedComment}</div>
          {comment.children.length > 0 && (
            <CommentList
              pageId={pageId}
              componentId={componentId}
              parentId={comment.commentId}
              referenceType={comment.referenceType}
              referenceId={comment.referenceId}
              readonly={readonly}
              isExpanded={isExpanded}
              limit={REPLIES_PER_PAGE}
            />
          )}
        </div>
      )}
      <BottomSheet
        isOpen={bottomSheet}
        onClose={toggleBottomSheet}
        mountPoint={document.getElementById('asc-uikit-stories-viewer') as HTMLElement}
        detent="content-height"
      >
        {options.map((bottomSheetAction) => (
          <Button
            className={styles.actionButton}
            variant="secondary"
            onClick={() => {
              bottomSheetAction.action();
              setBottomSheet(false);
            }}
          >
            {bottomSheetAction?.icon && bottomSheetAction?.icon}
            <Typography.BodyBold>{bottomSheetAction.name}</Typography.BodyBold>
          </Button>
        ))}
      </BottomSheet>
      <BottomSheet
        isOpen={!!selectedCommentId}
        onClose={() => setSelectedCommentId('')}
        mountPoint={document.getElementById('asc-uikit-stories-viewer') as HTMLElement}
        detent="full-height"
      >
        <ReactionList pageId="*" referenceId={comment.commentId} referenceType="comment" />
      </BottomSheet>
    </>
  );
};
