import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Typography, BottomSheet } from '~/v4/core/components';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import styles from './Comment.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import ReplyComment from '~/v4/icons/ReplyComment';
import { ReplyCommentList } from '~/v4/social/components/ReplyCommentList/ReplyCommentList';
import { MinusCircleIcon } from '~/v4/social/icons';
import { Mentionees } from '~/v4/helpers/utils';
import { CommentRepository, ReactionRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { LIKE_REACTION_KEY } from '~/v4/social/constants/reactions';
import { EditCancelButton } from '~/v4/social/elements/EditCancelButton/EditCancelButton';
import { SaveButton } from '~/v4/social/elements/SaveButton/SaveButton';
import clsx from 'clsx';
import { CommentInput } from '~/v4/social/components/CommentComposer/CommentInput';
import { CommentOptions } from '~/v4/social/components/CommentOptions/CommentOptions';
import { CreateCommentParams } from '~/v4/social/components/CommentComposer/CommentComposer';
import useCommentSubscription from '~/v4/core/hooks/subscriptions/useCommentSubscription';
import { TextWithMention } from '~/v4/social/internal-components/TextWithMention/TextWithMention';
import millify from 'millify';
import useCommunityPostPermission from '~/v4/social/hooks/useCommunityPostPermission';

const EllipsisH = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="4"
    viewBox="0 0 16 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M9.6875 2.25C9.6875 3.19922 8.91406 3.9375 8 3.9375C7.05078 3.9375 6.3125 3.19922 6.3125 2.25C6.3125 1.33594 7.05078 0.5625 8 0.5625C8.91406 0.5625 9.6875 1.33594 9.6875 2.25ZM13.9062 0.5625C14.8203 0.5625 15.5938 1.33594 15.5938 2.25C15.5938 3.19922 14.8203 3.9375 13.9062 3.9375C12.957 3.9375 12.2188 3.19922 12.2188 2.25C12.2188 1.33594 12.957 0.5625 13.9062 0.5625ZM2.09375 0.5625C3.00781 0.5625 3.78125 1.33594 3.78125 2.25C3.78125 3.19922 3.00781 3.9375 2.09375 3.9375C1.14453 3.9375 0.40625 3.19922 0.40625 2.25C0.40625 1.33594 1.14453 0.5625 2.09375 0.5625Z" />
  </svg>
);

const Like = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="16" cy="16" r="16" fill="url(#paint0_linear_1709_1733)" />
    <path
      d="M10.7752 12.1C11.2221 12.1 11.6002 12.4782 11.6002 12.925V21.175C11.6002 21.6563 11.2221 22 10.7752 22H8.0252C7.54395 22 7.2002 21.6563 7.2002 21.175V12.925C7.2002 12.4782 7.54395 12.1 8.0252 12.1H10.7752ZM9.4002 20.625C9.84707 20.625 10.2252 20.2813 10.2252 19.8C10.2252 19.3532 9.84707 18.975 9.4002 18.975C8.91895 18.975 8.5752 19.3532 8.5752 19.8C8.5752 20.2813 8.91895 20.625 9.4002 20.625ZM20.4002 7.2188C20.4002 8.66255 19.5064 9.48755 19.2314 10.45H22.7377C23.8721 10.45 24.7658 11.4125 24.7658 12.4782C24.8002 13.0969 24.5252 13.75 24.1127 14.1625C24.4564 14.9532 24.3877 16.0875 23.8033 16.8782C24.0783 17.7719 23.8033 18.8719 23.2189 19.4563C23.3908 20.075 23.3221 20.5907 23.0127 21.0032C22.3252 22 20.5721 22 19.0939 22H18.9908C17.3408 22 16.0002 21.4157 14.9002 20.9344C14.3502 20.6938 13.6283 20.3844 13.0783 20.3844C12.8721 20.35 12.7002 20.1782 12.7002 19.9719V12.6157C12.7002 12.5125 12.7346 12.4094 12.8033 12.3063C14.1783 10.9657 14.7627 9.5563 15.8627 8.42192C16.3783 7.9063 16.5502 7.15005 16.7564 6.3938C16.8939 5.77505 17.2033 4.40005 17.9252 4.40005C18.7502 4.40005 20.4002 4.67505 20.4002 7.2188Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1709_1733"
        x1="12"
        y1="3.2"
        x2="26.4"
        y2="39.2"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#63A1FF" />
        <stop offset="1" stopColor="#0041BE" />
      </linearGradient>
    </defs>
  </svg>
);

interface CommentProps {
  pageId?: string;
  componentId?: string;
  comment: Amity.Comment;
  community?: Amity.Community | null;
  onClickReply: (comment: Amity.Comment) => void;
  shouldAllowInteraction?: boolean;
}

export const Comment = ({
  pageId = '*',
  componentId = 'comment_bubble',
  comment,
  community,
  onClickReply,
  shouldAllowInteraction = true,
}: CommentProps) => {
  const { accessibilityId, isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { confirm } = useConfirmContext();

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [hasClickLoadMore, setHasClickLoadMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [commentData, setCommentData] = useState<CreateCommentParams>();
  const mentionRef = useRef<HTMLDivElement>(null);

  const [isShowMore, setIsShowMore] = useState(false);

  const { isModerator: isModeratorUser } = useCommunityPostPermission({
    community,
    userId: comment.creator?.userId,
  });

  const toggleBottomSheet = () => setBottomSheetOpen((prev) => !prev);

  const isLiked = (comment.myReactions || []).some((reaction) => reaction === 'like');

  const replyAmount = comment.childrenNumber;

  if (isExcluded) return null;

  const deleteComment = async () =>
    comment.commentId && CommentRepository.deleteComment(comment.commentId);

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const handleDeleteComment = () => {
    confirm({
      pageId,
      componentId,
      title: 'Delete comment',
      content: 'This comment will be permanently removed.',
      cancelText: 'Cancel',
      okText: 'Delete',
      onOk: deleteComment,
    });
  };

  const handleLike = async () => {
    if (!comment) return;

    if (!isLiked) {
      await ReactionRepository.addReaction('comment', comment?.commentId, LIKE_REACTION_KEY);
    } else {
      await ReactionRepository.removeReaction('comment', comment?.commentId, LIKE_REACTION_KEY);
    }
  };

  const handleSaveComment = useCallback(async () => {
    if (!commentData || !comment.commentId) return;

    await CommentRepository.updateComment(comment.commentId, {
      data: commentData.data,
      mentionees: commentData.mentionees as Amity.UserMention[],
      metadata: commentData.metadata,
    });

    setIsEditing(false);
  }, [commentData]);

  useCommentSubscription({
    commentId: comment.commentId,
  });

  return (
    <div style={themeStyles} data-qa-anchor={accessibilityId}>
      {comment.isDeleted ? (
        <div className={styles.postComment__deleteComment_container}>
          <MinusCircleIcon className={styles.postComment__deleteComment_icon} />
          <Typography.Body className={styles.postComment__deleteComment_text}>
            This comment has been deleted
          </Typography.Body>
        </div>
      ) : isEditing ? (
        <div className={styles.postComment__edit}>
          <UserAvatar pageId={pageId} componentId={componentId} userId={comment.userId} />
          <div className={styles.postComment__edit__inputWrap}>
            <div className={styles.postComment__edit__input}>
              <div className={styles.postComment__edit__mentionContainer} ref={mentionRef} />
              <CommentInput
                communityId={community?.communityId}
                value={{
                  data: {
                    text: (comment.data as Amity.ContentDataText).text,
                  },
                  mentionees: comment.mentionees as Mentionees,
                  metadata: comment.metadata || {},
                }}
                onChange={(value) => {
                  setCommentData({
                    data: {
                      text: value.text,
                    },
                    mentionees: value.mentionees as Amity.UserMention[],
                    metadata: {
                      mentioned: value.mentioned,
                    },
                  });
                }}
                maxLines={5}
                mentionContainer={mentionRef?.current}
              />
            </div>
            <div className={styles.postComment__edit__buttonWrap}>
              <EditCancelButton
                componentId="edit_comment_component"
                className={clsx(
                  styles.postComment__edit__button,
                  styles.postComment__edit__cancelButton,
                )}
                onPress={() => {
                  setIsEditing(false);
                }}
              />
              <SaveButton
                className={clsx(
                  styles.postComment__edit__button,
                  styles.postComment__edit__saveButton,
                )}
                componentId="edit_comment_component"
                onPress={handleSaveComment}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.postComment}>
          <UserAvatar pageId={pageId} componentId={componentId} userId={comment.userId} />
          <div className={styles.postComment__details}>
            <div className={styles.postComment__content}>
              <Typography.BodyBold
                data-qa-anchor={`${pageId}/${componentId}/username`}
                className={styles.postComment__content__username}
              >
                {comment.creator?.displayName}
              </Typography.BodyBold>

              {isModeratorUser && <ModeratorBadge pageId={pageId} componentId={componentId} />}

              <TextWithMention
                pageId={pageId}
                componentId={componentId}
                data={{ text: (comment.data as Amity.ContentDataText).text }}
                mentionees={comment.mentionees as Amity.UserMention[]}
                metadata={comment.metadata}
              />
            </div>
            <div className={styles.postComment__secondRow}>
              {shouldAllowInteraction && (
                <div className={styles.postComment__secondRow__leftPane}>
                  <Typography.Caption className={styles.postComment__secondRow__timestamp}>
                    <Timestamp
                      pageId={pageId}
                      componentId={componentId}
                      timestamp={comment.createdAt}
                    />
                    <span data-qa-anchor={`${pageId}/${componentId}/comment_edited_text`}>
                      {comment.createdAt !== comment.editedAt && ' (edited)'}
                    </span>
                  </Typography.Caption>

                  <div onClick={handleLike}>
                    <Typography.CaptionBold
                      className={styles.postComment__secondRow__like}
                      data-is-liked={isLiked}
                    >
                      {isLiked ? 'Liked' : 'Like'}
                    </Typography.CaptionBold>
                  </div>
                  <div
                    data-qa-anchor={`${pageId}/${componentId}/reply_button`}
                    onClick={() => onClickReply(comment)}
                  >
                    <Typography.CaptionBold className={styles.postComment__secondRow__reply}>
                      Reply
                    </Typography.CaptionBold>
                  </div>

                  <EllipsisH
                    className={styles.postComment__secondRow__actionButton}
                    onClick={() => setBottomSheetOpen(true)}
                  />
                </div>
              )}
              {comment.reactionsCount > 0 && (
                <div className={styles.postComment__secondRow__rightPane}>
                  <Typography.Caption>{millify(comment.reactionsCount)}</Typography.Caption>
                  <Like className={styles.postComment__secondRow__rightPane__like} />
                </div>
              )}
            </div>

            {replyAmount > 0 && !hasClickLoadMore && (
              <div
                data-qa-anchor={`${pageId}/${componentId}/view_reply_button`}
                className={styles.postComment__viewReply_button}
                onClick={() => setHasClickLoadMore(true)}
              >
                <ReplyComment className={styles.postComment__viewReply_icon} />
                <Typography.CaptionBold className={styles.postComment__viewReply_text}>
                  View {replyAmount} {replyAmount > 1 ? 'replies' : 'reply'}
                </Typography.CaptionBold>
              </div>
            )}

            {hasClickLoadMore && (
              <ReplyCommentList
                pageId={pageId}
                componentId={componentId}
                community={community ?? undefined}
                referenceId={comment.referenceId}
                referenceType={comment.referenceType}
                parentId={comment.commentId}
              />
            )}
          </div>
        </div>
      )}
      <BottomSheet
        onClose={toggleBottomSheet}
        isOpen={bottomSheetOpen}
        mountPoint={document.getElementById('asc-uikit-post-comment') as HTMLElement}
        detent="content-height"
      >
        <CommentOptions
          pageId={pageId}
          componentId={componentId}
          comment={comment}
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
          onCloseBottomSheet={toggleBottomSheet}
        />
      </BottomSheet>
    </div>
  );
};
