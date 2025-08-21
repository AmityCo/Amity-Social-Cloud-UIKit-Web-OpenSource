import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Typography, BottomSheet } from '~/v4/core/components';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import ReplyComment from '~/v4/icons/ReplyComment';
import { ReplyCommentList } from '~/v4/social/components/ReplyCommentList/ReplyCommentList';
import { MinusCircleIcon } from '~/v4/social/icons';
import { Mentionees } from '~/v4/helpers/utils';
import { CommentRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { EditCancelButton } from '~/v4/social/elements/EditCancelButton/EditCancelButton';
import { SaveButton } from '~/v4/social/elements/SaveButton/SaveButton';
import clsx from 'clsx';
import { CommentInput } from '~/v4/social/components/CommentComposer/CommentInput';
import { CommentOptions } from '~/v4/social/components/CommentOptions/CommentOptions';
import { CreateCommentParams } from '~/v4/social/components/CommentComposer/CommentComposer';
import { TextWithMention } from '~/v4/social/internal-components/TextWithMention/TextWithMention';
import useCommunityPostPermission from '~/v4/social/hooks/useCommunityPostPermission';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Popover } from '~/v4/core/components/AriaPopover';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge';
import { ReactionList } from '~/v4/social/components/ReactionList';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useNetworkState } from 'react-use';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { Button } from '~/v4/core/components/AriaButton';
import { useCommentReaction } from '~/v4/social/hooks/useCommentReaction';
import { CommentReactionDisplay } from '~/v4/social/internal-components/CommentReactionDisplay/CommentReactionDisplay';
import { ReactionButton } from '~/v4/social/elements/ReactionButton';
import styles from './Comment.module.css';

interface CommentProps {
  pageId?: string;
  componentId?: string;
  comment: Amity.Comment;
  community?: Amity.Community | null;
  onClickReply: (comment: Amity.Comment) => void;
  // If should not allow Interaction, it will hide timestamp also
  shouldAllowInteraction?: boolean;
  // Hide only interaction button
  shouldShowInteractionButton?: boolean;
  highlightedCommentId?: string;
  parentId?: string;
  hideOptionButton?: boolean;
  maxLines?: number;
  // support inline comment - expaned reply comment for a highlight comment as default
  showReply?: boolean;
  // support inline comment behavior - behavior when click show reply
  onClickShowReply?: () => void;
}

export const Comment = ({
  pageId = '*',
  componentId = 'comment_bubble',
  comment,
  community,
  onClickReply,
  hideOptionButton = false,
  shouldAllowInteraction = true,
  highlightedCommentId = undefined,
  parentId = undefined,
  showReply,
  onClickShowReply,
  maxLines,
}: CommentProps) => {
  const { accessibilityId, isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { isDesktop } = useResponsive();
  const { setDrawerData } = useDrawer();
  const { openPopup, closePopup } = usePopupContext();
  const { confirm } = useConfirmContext();
  const { goToUserProfilePage } = useNavigation();
  const mentionRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [hasClickLoadMore, setHasClickLoadMore] = useState(false);
  const [commentData, setCommentData] = useState<CreateCommentParams>();
  const [highlightedReplyComment, setHighlightedReplyComment] = useState<Amity.Comment | undefined>(
    undefined,
  );
  const notification = useNotifications();
  const { online } = useNetworkState();
  const { page } = useNavigation();

  const { isModerator: isModeratorUser } = useCommunityPostPermission({
    community,
    userId: comment.creator?.userId,
  });

  const isBrandUser = comment.creator?.isBrand ?? false;

  const { onClickUser } = useNavigation();

  const toggleBottomSheet = () => setBottomSheetOpen((prev) => !prev);

  const {
    reactionByMe,
    setReactionByMe,
    reactionsCount,
    mutateAddReactionAsync,
    mutateRemoveReactionAsync,
  } = useCommentReaction({ comment });

  const replyAmount = comment.childrenNumber;

  if (isExcluded) return null;

  useEffect(() => {
    highlightedCommentId &&
      parentId &&
      CommentRepository.getComment(highlightedCommentId, (resp) => {
        setHighlightedReplyComment(resp.data as Amity.Comment);
      });
  }, [highlightedCommentId, parentId]);

  const deleteComment = async () =>
    comment.commentId && CommentRepository.deleteComment(comment.commentId);

  const handleEditComment = () => {
    toggleBottomSheet();
    setIsEditing(true);
  };

  const handleDeleteComment = () => {
    toggleBottomSheet();
    if (!online) {
      notification.info({
        content: 'Oops, something went wrong',
        alignment: `${page.type === PageTypes.ViewStoryPage ? 'fullscreen' : 'withSidebar'}`,
      });
      return;
    }
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

  const handleReactionClick = (reactionKey: string) => {
    if (reactionByMe === null) {
      mutateAddReactionAsync(reactionKey);
      setReactionByMe(reactionKey);
    } else if (reactionByMe !== reactionKey) {
      mutateRemoveReactionAsync(reactionByMe);
      mutateAddReactionAsync(reactionKey);
      setReactionByMe(reactionKey);
    } else {
      mutateRemoveReactionAsync(reactionByMe);
      setReactionByMe(null);
    }
  };

  const handleSaveComment = useCallback(async () => {
    if (!online) {
      notification.info({
        content: 'Oops, something went wrong',
        alignment: `${page.type === PageTypes.ViewStoryPage ? 'fullscreen' : 'withSidebar'}`,
      });
      return;
    }
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

  const isHighlightedReply = parentId === comment.commentId;

  const isHighlightedComment = highlightedCommentId === comment.commentId && !parentId;

  const isShowViewMoreReplies =
    replyAmount > 0 &&
    !hasClickLoadMore &&
    (!isHighlightedReply || (isHighlightedComment && !hasClickLoadMore));

  const isShowReplyList =
    (hasClickLoadMore && replyAmount > 0 && !parentId) ||
    (isHighlightedReply && replyAmount > 0) ||
    highlightedReplyComment?.isDeleted;

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
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
                mentionContainerClassName={styles.postComment__mentionContainer}
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
                isDisabled={
                  !commentData?.data.text ||
                  commentData?.data.text === (comment.data as Amity.ContentDataText).text
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.postComment}>
          <UserAvatar
            pageId={pageId}
            componentId={componentId}
            userId={comment.userId}
            shouldRedirectToUserProfile
          />
          <div className={styles.postComment__details}>
            <div
              className={styles.postComment__content}
              data-has-reaction={reactionsCount > 0}
              onClick={() => onClickUser(comment.creator?.userId ?? '')}
            >
              <Button
                variant="default"
                onPress={() => {
                  closePopup();
                  goToUserProfilePage(comment.creator?.userId as string);
                }}
                className={styles.postComment__userInfo}
              >
                <Typography.BodyBold
                  data-testid={`${pageId}/${componentId}/username`}
                  className={styles.postComment__content__username}
                >
                  {comment.creator?.displayName}
                </Typography.BodyBold>
                {isBrandUser && <BrandBadge className={styles.postComment__brandBadge} />}
              </Button>

              {isModeratorUser && !isBrandUser && (
                <ModeratorBadge pageId={pageId} componentId={componentId} />
              )}

              <TextWithMention
                pageId={pageId}
                componentId={componentId}
                data={{ text: (comment.data as Amity.ContentDataText).text }}
                mentionees={comment.mentionees as Amity.UserMention[]}
                metadata={comment.metadata}
                maxLines={maxLines}
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
                className={styles.postComment__secondRow__rightPane}
                reactionsClassName={styles.postComment__secondRow__rightPane__reactions}
                iconClassName={styles.postComment__secondRow__rightPane__icon}
                iconFallbackClassName={styles.postComment__secondRow__rightPane__iconFallback}
                reactionCountClassName={styles.postComment__secondRow__rightPane__reactionCount}
              />
            </div>

            <div className={styles.postComment__secondRow}>
              {shouldAllowInteraction ? (
                <div className={styles.postComment__secondRow__leftPane}>
                  <Typography.Caption className={styles.postComment__secondRow__timestamp}>
                    <Timestamp
                      pageId={pageId}
                      componentId={componentId}
                      timestamp={comment.createdAt}
                    />
                    <span data-testid={`${pageId}/${componentId}/comment_edited_text`}>
                      {comment.createdAt !== comment.editedAt && ' (edited)'}
                    </span>
                  </Typography.Caption>
                  {community && community.isJoined && (
                    <>
                      <ReactionButton
                        pageId={pageId}
                        componentId={componentId}
                        myReaction={reactionByMe}
                        onReactionClick={handleReactionClick}
                        buttonClassName={styles.postComment__secondRow__like}
                        isCommentReaction
                      />
                      <Button
                        data-testid={`${pageId}/${componentId}/reply_button`}
                        variant="default"
                        onPress={() => onClickReply(comment)}
                      >
                        <Typography.CaptionBold className={styles.postComment__secondRow__reply}>
                          Reply
                        </Typography.CaptionBold>
                      </Button>
                    </>
                  )}
                  {!hideOptionButton && (
                    <Popover
                      trigger={{
                        onClick: () => setBottomSheetOpen(true),
                        className: styles.postComment__secondRow__actionButton,
                        iconClassName: styles.postComment__secondRow__actionButton__icon,
                      }}
                    >
                      {({ closePopover }) => (
                        <CommentOptions
                          pageId={pageId}
                          componentId={componentId}
                          comment={comment}
                          handleEditComment={() => {
                            closePopover();
                            handleEditComment();
                          }}
                          handleDeleteComment={() => {
                            closePopover();
                            handleDeleteComment();
                          }}
                          onCloseMenu={closePopover}
                        />
                      )}
                    </Popover>
                  )}
                </div>
              ) : (
                <div />
              )}
            </div>

            {isShowViewMoreReplies && !showReply && (
              <Button
                variant="default"
                data-testid={`${pageId}/${componentId}/view_reply_button`}
                className={styles.postComment__viewReply_button}
                onPress={() => {
                  if (onClickShowReply) return onClickShowReply();
                  setHasClickLoadMore(true);
                }}
              >
                <ReplyComment className={styles.postComment__viewReply_icon} />
                <Typography.CaptionBold className={styles.postComment__viewReply_text}>
                  View {replyAmount} {replyAmount > 1 ? 'replies' : 'reply'}
                </Typography.CaptionBold>
              </Button>
            )}

            {(isShowReplyList || showReply) && (
              <ReplyCommentList
                pageId={pageId}
                componentId={componentId}
                community={community ?? undefined}
                referenceId={comment.referenceId}
                referenceType={comment.referenceType}
                parentId={comment.commentId}
                highlightedCommentId={isHighlightedReply ? highlightedCommentId : undefined}
              />
            )}
          </div>
        </div>
      )}
      {!isDesktop && !hideOptionButton && (
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
            onCloseMenu={toggleBottomSheet}
          />
        </BottomSheet>
      )}
    </div>
  );
};
