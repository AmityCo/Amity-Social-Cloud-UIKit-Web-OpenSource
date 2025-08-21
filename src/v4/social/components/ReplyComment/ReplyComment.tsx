import { CommentRepository } from '@amityco/ts-sdk';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { BottomSheet, Typography } from '~/v4/core/components';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { Mentionees } from '~/v4/helpers/utils';
import { EditCancelButton } from '~/v4/social/elements/EditCancelButton/EditCancelButton';
import { BrandBadge, ReactionButton, SaveButton } from '~/v4/social/elements';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge/ModeratorBadge';
import { Timestamp } from '~/v4/social/elements/Timestamp/Timestamp';
import { MinusCircleIcon } from '~/v4/social/icons';
import { TextWithMention } from '~/v4/social/internal-components/TextWithMention/TextWithMention';
import { UserAvatar } from '~/v4/social/elements/UserAvatar/UserAvatar';
import { CommentOptions } from '~/v4/social/components/CommentOptions/CommentOptions';
import { CreateCommentParams } from '~/v4/social/components/CommentComposer/CommentComposer';
import { CommentInput } from '~/v4/social/components/CommentComposer/CommentInput';
import useCommunityPostPermission from '~/v4/social/hooks/useCommunityPostPermission';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Popover } from '~/v4/core/components/AriaPopover';
import { ReactionList } from '~/v4/social/components/ReactionList';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useReactionHandler } from '~/v4/core/hooks/useReactionHandler';
import { useCommentReaction } from '~/v4/social/hooks/useCommentReaction';
import { useCommentReactionDisplay } from '~/v4/social/hooks/useCommentReactionDisplay';
import { CommentReactionDisplay } from '~/v4/social/internal-components/CommentReactionDisplay/CommentReactionDisplay';
import styles from './ReplyComment.module.css';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';

type ReplyCommentProps = {
  pageId?: string;
  community?: Amity.Community;
  comment: Amity.Comment;
  isHighlightDeleted?: boolean;
  testId?: string;
};

const PostReplyComment = ({
  pageId = '*',
  community,
  comment,
  isHighlightDeleted = false,
  testId,
}: ReplyCommentProps) => {
  const componentId = 'post_comment';
  const { confirm } = useConfirmContext();
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { setDrawerData } = useDrawer();
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();

  const notification = useNotifications();

  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityComponent({
      pageId,
      componentId,
    });

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [commentData, setCommentData] = useState<CreateCommentParams>();

  const { isModerator: isModeratorUser } = useCommunityPostPermission({
    community,
    userId: comment.creator?.userId,
  });

  // Use comment reaction hook for better reaction management
  const {
    reactionByMe,
    setReactionByMe,
    reactionsCount,
    mutateAddReactionAsync,
    mutateRemoveReactionAsync,
  } = useCommentReaction({
    comment,
  });

  useCommentReactionDisplay({ comment });

  const onReactionClick = async (reactionKey: string) => {
    if (reactionByMe === null) {
      await mutateAddReactionAsync(reactionKey);
    } else if (reactionByMe !== reactionKey) {
      await mutateRemoveReactionAsync(reactionByMe);
      await mutateAddReactionAsync(reactionKey);
    } else {
      await mutateRemoveReactionAsync(reactionByMe);
    }
  };

  const handleReactionClick = (reactionKey: string) => {
    if (community)
      return handleCommunityProfileBehavior({
        defaultBehavior: () => onReactionClick(reactionKey),
        allowNonMember: false,
        isJoined: community?.isJoined,
      });

    return handleUserProfileBehavior({
      defaultBehavior: () => onReactionClick(reactionKey),
      allowNonFollower: true,
    });
  };

  // Use reaction handler for long press functionality
  useReactionHandler({
    myReaction: reactionByMe,
    onReactionClick: handleReactionClick,
  });

  const isBrandUser = comment.creator?.isBrand ?? false;

  const toggleBottomSheet = () => setBottomSheetOpen((prev) => !prev);

  const deleteComment = async () =>
    comment.commentId && CommentRepository.deleteComment(comment.commentId);

  const handleEditComment = () => {
    toggleBottomSheet();
    setIsEditing(true);
  };

  const handleDeleteComment = () => {
    toggleBottomSheet();
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

  const handleSaveComment = useCallback(async () => {
    if (!commentData || !comment.commentId) return;

    await CommentRepository.updateComment(comment.commentId, {
      data: commentData.data,
      mentionees: commentData.mentionees as Amity.UserMention[],
      metadata: commentData.metadata,
    }).catch((error) => {
      if (error.message.includes(ERROR_RESPONSE.BLOCKED_WORD)) {
        notification.info({
          content: 'Your comment contains inappropriate word. Please review and delete it.',
        });
      } else if (error.message.includes(ERROR_RESPONSE.BLOCKED_URL)) {
        notification.info({
          content: 'Your comment contains a link that’s not allowed. Please review and delete it.',
        });
      } else {
        notification.info({
          content: 'Oops, something went wrong',
        });
      }
    });

    setIsEditing(false);
  }, [commentData]);

  if (isExcluded) return null;

  return (
    <>
      {comment.isDeleted ? (
        <div
          data-isdeleted-highlight={isHighlightDeleted}
          className={styles.postReplyComment__deleteComment_container}
          style={themeStyles}
        >
          <MinusCircleIcon className={styles.postReplyComment__deleteComment_icon} />
          <Typography.Caption className={styles.postReplyComment__deleteComment_text}>
            This reply has been deleted
          </Typography.Caption>
        </div>
      ) : isEditing ? (
        <div className={styles.postReplyComment__edit}>
          <UserAvatar pageId={pageId} componentId={componentId} userId={comment.userId} />
          <div className={styles.postReplyComment__edit__inputWrap}>
            <div className={styles.postReplyComment__edit__input}>
              <CommentInput
                pageId={pageId}
                componentId={componentId}
                communityId={community?.communityId}
                mentionContainerClassName={styles.postReplyComment__mentionContainer}
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
        <div className={styles.postReplyComment} style={themeStyles} data-testid={testId}>
          <UserAvatar pageId={pageId} componentId={componentId} userId={comment.userId} />
          <div className={styles.postReplyComment__details}>
            <div
              data-has-reaction={reactionsCount > 0}
              className={styles.postReplyComment__content}
            >
              <div className={styles.postReplyComment__userInfo}>
                <Typography.BodyBold
                  data-testid={`${pageId}/${componentId}/username`}
                  className={styles.postReplyComment__content__username}
                >
                  {comment.creator?.displayName}
                </Typography.BodyBold>
                {isBrandUser && <BrandBadge className={styles.postReplyComment__brandBadge} />}
              </div>
              {isModeratorUser && <ModeratorBadge pageId={pageId} componentId={componentId} />}
              <TextWithMention
                pageId={pageId}
                componentId={componentId}
                data={{ text: (comment.data as Amity.ContentDataText).text }}
                mentionees={comment.mentionees as Amity.UserMention[]}
                metadata={comment.metadata}
                testId={`${pageId}/${componentId}/reply-comment-text`}
              />
              <CommentReactionDisplay
                pageId={pageId}
                componentId={componentId}
                comment={comment}
                reactionsCount={reactionsCount}
                position="replyComment"
                onReactionPress={() => {
                  const reactionList = (
                    <ReactionList
                      pageId={pageId}
                      referenceType="comment"
                      referenceId={comment.commentId}
                      customReferenceType="reply"
                    />
                  );
                  isDesktop
                    ? openPopup({ view: 'desktop', children: reactionList })
                    : setDrawerData({
                        content: reactionList,
                        snapPoints: [0.7, 1],
                        activeSnapPoint: 0.7,
                      });
                }}
              />
              <CommentReactionDisplay
                pageId={pageId}
                comment={comment}
                reactionsCount={reactionsCount}
                onReactionPress={() => {
                  const reactionList = (
                    <ReactionList
                      pageId={pageId}
                      referenceType="comment"
                      referenceId={comment.commentId}
                      customReferenceType="reply"
                    />
                  );
                  isDesktop
                    ? openPopup({ view: 'desktop', children: reactionList })
                    : setDrawerData({
                        content: reactionList,
                        snapPoints: [0.7, 1],
                        activeSnapPoint: 0.7,
                      });
                }}
                className={styles.postReplyComment__secondRow__rightPane}
                reactionsClassName={styles.postReplyComment__secondRow__rightPane__reactions}
                iconClassName={styles.postReplyComment__secondRow__rightPane__icon}
                iconFallbackClassName={styles.postReplyComment__secondRow__rightPane__iconFallback}
                reactionCountClassName={
                  styles.postReplyComment__secondRow__rightPane__reactionCount
                }
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
                  <span data-testid={`${pageId}/${componentId}/reply_comment_edited_text`}>
                    {comment.createdAt !== comment.editedAt && ' (edited)'}
                  </span>
                </Typography.Caption>
                <ReactionButton
                  pageId={pageId}
                  componentId={componentId}
                  myReaction={reactionByMe}
                  onReactionClick={handleReactionClick}
                  buttonClassName={styles.postReplyComment__secondRow__like}
                  isCommentReaction
                  referenceType="comment"
                  community={community}
                />
                <Popover
                  trigger={{
                    pageId,
                    componentId,
                    onClick: () => setBottomSheetOpen(true),
                    className: styles.postReplyComment__secondRow__actionButton,
                    iconClassName: styles.postReplyComment__secondRow__actionButton__icon,
                  }}
                >
                  {({ closePopover }) => (
                    <CommentOptions
                      pageId={pageId}
                      componentId={componentId}
                      comment={comment}
                      onCloseMenu={closePopover}
                      handleEditComment={handleEditComment}
                      handleDeleteComment={() => {
                        closePopover();
                        handleDeleteComment();
                      }}
                    />
                  )}
                </Popover>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isDesktop && (
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
            onCloseMenu={toggleBottomSheet}
            handleEditComment={handleEditComment}
            handleDeleteComment={handleDeleteComment}
          />
        </BottomSheet>
      )}
    </>
  );
};

export default PostReplyComment;
