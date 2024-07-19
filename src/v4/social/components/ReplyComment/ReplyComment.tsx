import { CommentRepository, ReactionRepository } from '@amityco/ts-sdk';
import clsx from 'clsx';
import millify from 'millify';
import React, { useCallback, useState } from 'react';
import EllipsisH from '~/icons/EllipsisH';
import { BottomSheet, Typography } from '~/v4/core/components';
import useCommentSubscription from '~/v4/core/hooks/subscriptions/useCommentSubscription';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { Mentionees } from '~/v4/helpers/utils';
import { LIKE_REACTION_KEY } from '~/v4/social/constants/reactions';
import { EditCancelButton } from '~/v4/social/elements/EditCancelButton/EditCancelButton';
import { SaveButton } from '~/v4/social/elements';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge/ModeratorBadge';
import Like from '~/v4/social/elements/ReactionButton/Like';
import { Timestamp } from '~/v4/social/elements/Timestamp/Timestamp';
import { MinusCircleIcon } from '~/v4/social/icons';
import { TextWithMention } from '~/v4/social/internal-components/TextWithMention/TextWithMention';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar/UserAvatar';
import { CommentOptions } from '~/v4/social/components/CommentOptions/CommentOptions';
import { CreateCommentParams } from '~/v4/social/components/CommentComposer/CommentComposer';
import { CommentInput } from '~/v4/social/components/CommentComposer/CommentInput';
import styles from './ReplyComment.module.css';

type ReplyCommentProps = {
  pageId?: string;
  community?: Amity.Community;
  comment: Amity.Comment;
};

const PostReplyComment = ({ pageId = '*', community, comment }: ReplyCommentProps) => {
  const componentId = 'post_comment';
  const { confirm } = useConfirmContext();
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityComponent({
      pageId,
      componentId,
    });

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [commentData, setCommentData] = useState<CreateCommentParams>();

  const isLiked = (comment.myReactions || []).some((reaction) => reaction === 'like');

  const toggleBottomSheet = () => setBottomSheetOpen((prev) => !prev);

  const deleteComment = async () =>
    comment.commentId && CommentRepository.deleteComment(comment.commentId);

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const handleDeleteComment = () => {
    confirm({
      pageId,
      componentId,
      title: 'Delete reply',
      content: 'This reply will be permanently removed.',
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

  if (isExcluded) return null;

  return (
    <>
      {comment.isDeleted ? (
        <div className={styles.postReplyComment__deleteComment_container} style={themeStyles}>
          <MinusCircleIcon className={styles.postReplyComment__deleteComment_icon} />
          <Typography.Caption className={styles.postReplyComment__deleteComment_text}>
            This reply has been deleted
          </Typography.Caption>
        </div>
      ) : isEditing ? (
        <div className={styles.postReplyComment__edit}>
          <UserAvatar userId={comment.userId} />
          <div className={styles.postReplyComment__edit__inputWrap}>
            <div className={styles.postReplyComment__edit__input}>
              <CommentInput
                community={community}
                value={{
                  data: {
                    text: (comment.data as Amity.ContentDataText).text,
                  },
                  mentionees: comment.mentionees as Mentionees,
                  metadata: comment.metadata || {},
                }}
                onChange={(value: CreateCommentParams) => {
                  setCommentData(value);
                }}
              />
            </div>
            <div className={styles.postReplyComment__edit__buttonWrap}>
              <EditCancelButton
                componentId="edit_comment_component"
                className={clsx(
                  styles.postReplyComment__edit__button,
                  styles.postReplyComment__edit__cancelButton,
                )}
                onPress={() => {
                  setIsEditing(false);
                }}
              />
              <SaveButton
                className={clsx(
                  styles.postReplyComment__edit__button,
                  styles.postReplyComment__edit__saveButton,
                )}
                componentId="edit_comment_component"
                onPress={handleSaveComment}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={styles.postReplyComment}
          style={themeStyles}
          data-qa-anchor={accessibilityId}
        >
          <UserAvatar userId={comment.userId} />
          <div className={styles.postReplyComment__details}>
            <div className={styles.postReplyComment__content}>
              <Typography.BodyBold className={styles.postReplyComment__content__username}>
                {comment.creator?.displayName}
              </Typography.BodyBold>

              <ModeratorBadge pageId={pageId} componentId={componentId} />
              <TextWithMention
                data={{ text: (comment.data as Amity.ContentDataText).text }}
                mentionees={comment.mentionees as Amity.UserMention[]}
                metadata={comment.metadata}
              />
            </div>
            <div className={styles.postReplyComment__secondRow}>
              <div className={styles.postReplyComment__secondRow__leftPane}>
                <Typography.Caption className={styles.postReplyComment__secondRow__timestamp}>
                  <Timestamp
                    pageId={pageId}
                    componentId={componentId}
                    timestamp={comment.createdAt}
                  />
                  {comment.createdAt !== comment.editedAt && ' (edited)'}
                </Typography.Caption>
                <div onClick={handleLike}>
                  <Typography.CaptionBold
                    className={styles.postReplyComment__secondRow__like}
                    data-is-liked={isLiked}
                  >
                    {isLiked ? 'Liked' : 'Like'}
                  </Typography.CaptionBold>
                </div>
                <EllipsisH
                  className={styles.postReplyComment__secondRow__actionButton}
                  onClick={() => setBottomSheetOpen(true)}
                />
              </div>
              {comment.reactionsCount > 0 && (
                <div className={styles.postReplyComment__secondRow__rightPane}>
                  <Typography.Caption>{millify(comment.reactionsCount)}</Typography.Caption>
                  <Like className={styles.postReplyComment__secondRow__rightPane__like} />
                </div>
              )}
            </div>
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
          comment={comment}
          onCloseBottomSheet={toggleBottomSheet}
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
        />
      </BottomSheet>
    </>
  );
};

export default PostReplyComment;
