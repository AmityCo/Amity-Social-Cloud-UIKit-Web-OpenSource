import React, { useEffect, useRef, useState } from 'react';
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
import { ReactionList } from '~/v4/social/components/ReactionList';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useNetworkState } from 'react-use';
import { Button } from '~/v4/core/components/AriaButton';
import { useCommentReaction } from '~/v4/social/hooks/useCommentReaction';
import { useDeleteComment } from '~/v4/social/hooks/useDeleteComment';
import { CommentReactionDisplay } from '~/v4/social/internal-components/CommentReactionDisplay/CommentReactionDisplay';
import { ReactionButton } from '~/v4/social/elements/ReactionButton';
import styles from './Comment.module.css';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import { useUpdateComment } from '~/v4/social/hooks/useUpdateComment';
import { BrandBadge, EventHostBadge } from '~/v4/social/elements';
import { EVENT_LISTENER } from '~/v4/social/constants/eventListener';

interface CommentProps {
  pageId?: string;
  componentId?: string;
  comment: Amity.Comment;
  community?: Amity.Community | null;
  onClickReply: (params: {
    comment: Amity.Comment;
    parentIdOverride?: string;
    l0AncestorId?: string;
  }) => void;
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
  testId?: string;
  isHost?: boolean;
  renderReplyComment?: (comment: Amity.Comment) => React.ReactNode;
  /** The L1 comment ID currently being replied to — used to position the inline
   *  composer directly after that specific L1 in the ReplyCommentList. */
  replyTargetCommentId?: string;
  /** Original parentId from the notification — the direct parent of the target comment.
   *  For L1 notifications this equals the L0 ID; for L2 it equals the L1 ID. */
  parantId?: string;
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
  testId,
  isHost,
  renderReplyComment,
  replyTargetCommentId,
  parantId,
}: CommentProps) => {
  const { accessibilityId, isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();

  const { isDesktop } = useResponsive();
  const { setDrawerData } = useDrawer();
  const { openPopup, closePopup } = usePopupContext();
  const { confirm } = useConfirmContext();
  const { goToUserProfilePage } = useNavigation();
  const mentionRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [hasClickLoadMore, setHasClickLoadMore] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const isHighlightedComment = highlightedCommentId === comment.commentId && !parentId;
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

  // Pending L1 comments captured before ReplyCommentList is even mounted (first reply case).
  const [pendingL1Comments, setPendingL1Comments] = useState<Amity.Comment[]>([]);

  // Auto-expand the reply thread when the user creates the very first L1 reply under this
  // L0 comment. At that point ReplyCommentList is not yet mounted (showThread is false),
  // so we listen here and set hasClickLoadMore → true to mount & show the list immediately.
  // We also stash the comment so ReplyCommentList can show it instantly as a pending item.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ parentId: string; comment: Amity.Comment }>).detail;
      if (detail.parentId === comment.commentId) {
        setHasClickLoadMore(true);
        setPendingL1Comments((prev) =>
          prev.some((p) => p.commentId === detail.comment.commentId)
            ? prev
            : [detail.comment, ...prev],
        );
      }
    };
    document.addEventListener(EVENT_LISTENER.REPLY_CREATED, handler);
    return () => document.removeEventListener(EVENT_LISTENER.REPLY_CREATED, handler);
  }, [comment.commentId]);

  // Bounce the L0 comment bubble when it is the direct notification target.
  const hasL0CommentBouncedRef = useRef(false);

  useEffect(() => {
    hasL0CommentBouncedRef.current = false;
  }, [highlightedCommentId]);

  useEffect(() => {
    if (!isHighlightedComment) return;
    const handleScrollComplete = (e: CustomEvent) => {
      if (e.detail.commentId === comment.commentId && !hasL0CommentBouncedRef.current) {
        hasL0CommentBouncedRef.current = true;
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), 1000);
      }
    };
    document.addEventListener(
      EVENT_LISTENER.SCROLL_COMPLETE,
      handleScrollComplete as EventListener,
    );
    return () =>
      document.removeEventListener(
        EVENT_LISTENER.SCROLL_COMPLETE,
        handleScrollComplete as EventListener,
      );
  }, [isHighlightedComment, comment.commentId]);

  // L0 fallback: trigger bounce if SCROLL_COMPLETE was already dispatched before
  // this Comment mounted (e.g. comment data loaded after the scroll completed).
  useEffect(() => {
    if (!isHighlightedComment) return;
    const fallback = setTimeout(() => {
      if (!hasL0CommentBouncedRef.current) {
        hasL0CommentBouncedRef.current = true;
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), 1000);
      }
    }, 3000);
    return () => clearTimeout(fallback);
  }, [isHighlightedComment, comment.commentId]);

  useEffect(() => {
    highlightedCommentId &&
      parentId &&
      CommentRepository.getComment(highlightedCommentId, (resp) => {
        setHighlightedReplyComment(resp.data as Amity.Comment);
      });
  }, [highlightedCommentId, parentId]);

  if (isExcluded) return null;

  const { handleDeleteComment: deleteComment } = useDeleteComment({
    commentId: comment.commentId,
    parentId: comment.parentId ?? undefined,
  });

  const handleEditComment = () => {
    toggleBottomSheet();
    setIsEditing(true);
  };

  const handleDeleteComment = () => {
    toggleBottomSheet();
    if (!online) {
      notification.info({
        content: 'No internet connection.',
        alignment: `${page.type === PageTypes.ViewStoryPage ? 'fullscreen' : 'withSidebar'}`,
      });
      return;
    }
    confirm({
      pageId,
      componentId,
      title: 'Delete comment',
      content: 'This comment will be permanently deleted.',
      cancelText: 'Cancel',
      okText: 'Delete',
      onOk: deleteComment,
    });
  };

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

  const handleReplyClick = ({
    comment,
    parentIdOverride,
    l0AncestorId,
  }: {
    comment: Amity.Comment;
    parentIdOverride?: string;
    l0AncestorId?: string;
  }) => {
    if (community)
      return handleCommunityProfileBehavior({
        defaultBehavior: () => onClickReply({ comment, parentIdOverride, l0AncestorId }),
        allowNonMember: false,
        isJoined: community?.isJoined,
      });

    handleUserProfileBehavior({
      defaultBehavior: () => onClickReply({ comment, parentIdOverride, l0AncestorId }),
      allowNonFollower: true,
    });
  };

  const { handleSaveComment } = useUpdateComment({
    commentId: comment.commentId,
    commentData,
    setIsEditing,
  });

  const isHighlightedReply = parentId === comment.commentId;

  const isL2Target =
    isHighlightedReply &&
    !!highlightedReplyComment &&
    highlightedReplyComment.parentId !== comment.commentId;

  // Prefer synchronous detection when parantId is present; fall back to the
  // async highlightedReplyComment path for cases without a notification context.
  // parantId === comment.commentId → L1 target; parantId !== comment.commentId → L2 target.
  const effectiveIsL2Target = parantId ? parantId !== comment.commentId : isL2Target;

  // L1 ID to pass as showReplyCommentAt — tells the L1 ReplyCommentList to auto-expand
  // the matching L1 bubble's L2 sub-list. Suppressed when the L2 target is deleted so the
  // L1 bubble doesn't show a thread line pointing to no visible replies.
  const effectiveShowReplyCommentAt =
    effectiveIsL2Target && !highlightedReplyComment?.isDeleted
      ? parantId ?? highlightedReplyComment?.parentId
      : undefined;

  // When arriving from an L1/L2 notification and the L0 ancestor is deleted, auto-expand
  // the reply list so the pinned L1 (and its L2 target) are immediately visible without
  // requiring the user to manually tap "View replies".
  useEffect(() => {
    if (comment.isDeleted && (effectiveIsL2Target || isHighlightedReply) && replyAmount > 0) {
      setHasClickLoadMore(true);
    }
  }, [comment.isDeleted, effectiveIsL2Target, isHighlightedReply, replyAmount]);

  const replyComposer = renderReplyComment?.(comment);

  const isShowViewMoreReplies =
    replyAmount > 0 &&
    !hasClickLoadMore &&
    !replyComposer &&
    (!isHighlightedReply || (isHighlightedComment && !hasClickLoadMore));

  const isShowReplyList =
    (hasClickLoadMore && !parentId) ||
    (isHighlightedReply && replyAmount > 0) ||
    highlightedReplyComment?.isDeleted;

  const showThread = isShowReplyList || !!showReply || !!replyComposer;

  // Once the L1 thread is visible, persist the expanded state so it doesn't collapse
  // when the reply composer closes after creating an L2 comment.
  useEffect(() => {
    if (showThread) {
      setHasClickLoadMore(true);
    }
  }, [showThread]);

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      {comment.isDeleted ? (
        <div
          className={styles.postComment__deleteComment}
          data-testid={`${pageId}/${componentId}/comment-deleted-tag`}
        >
          <div className={styles.postComment__deleteComment_avatarSlot}>
            <MinusCircleIcon className={styles.postComment__deleteComment_icon} />
          </div>
          <div className={styles.postComment__details}>
            <Typography.Body className={styles.postComment__deleteComment_text}>
              This comment has been deleted
            </Typography.Body>
            {replyAmount > 0 && !hasClickLoadMore && (
              <Button
                variant="default"
                data-testid={`${pageId}/${componentId}/view_reply_button`}
                className={styles.postComment__viewReply_button}
                onPress={() => setHasClickLoadMore(true)}
              >
                <ReplyComment className={styles.postComment__viewReply_icon} />
                <Typography.CaptionBold className={styles.postComment__viewReply_text}>
                  View {replyAmount} {replyAmount > 1 ? 'replies' : 'reply'}
                </Typography.CaptionBold>
              </Button>
            )}
          </div>
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
                  links: comment.links || [],
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
                    links: value.links || [],
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
                  (commentData?.data.text === (comment.data as Amity.ContentDataText).text &&
                    JSON.stringify(commentData?.links || []) ===
                      JSON.stringify(comment.links || []))
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={clsx(styles.postComment, isHighlighted && styles.postComment__bounce)}
          data-testid={testId}
        >
          <UserAvatar
            pageId={pageId}
            componentId={componentId}
            userId={comment.userId}
            shouldRedirectToUserProfile
          />
          <div className={styles.postComment__details} data-testid="post-comment-details">
            <Button
              data-testid="post-comment-button-content"
              variant="default"
              className={styles.postComment__content}
              data-has-reaction={reactionsCount > 0}
              onPress={() => onClickUser(comment.creator?.userId ?? '')}
            >
              <Button
                variant="default"
                onPress={() => {
                  closePopup();
                  goToUserProfilePage(comment.creator?.userId as string);
                }}
                className={styles.postComment__userInfo}
                data-testid={`post-comment-user-${comment.creator?.userId}`}
              >
                <Typography.BodyBold
                  data-testid={`${pageId}/${componentId}/username`}
                  className={styles.postComment__content__username}
                >
                  {comment.creator?.displayName}
                </Typography.BodyBold>
                {isBrandUser && (
                  <BrandBadge
                    pageId={pageId}
                    componentId={componentId}
                    className={styles.postComment__brandBadge}
                  />
                )}
              </Button>

              {isHost ? (
                <EventHostBadge withLabel />
              ) : (
                isModeratorUser && <ModeratorBadge pageId={pageId} componentId={componentId} />
              )}

              <TextWithMention
                pageId={pageId}
                componentId={componentId}
                data={{ text: (comment.data as Amity.ContentDataText).text }}
                links={comment.links}
                mentionees={comment.mentionees as Amity.UserMention[]}
                metadata={comment.metadata}
                maxLines={maxLines}
                testId={`${pageId}/${componentId}/comment-text`}
              />

              <CommentReactionDisplay
                pageId={pageId}
                componentId={componentId}
                comment={comment}
                reactionsCount={reactionsCount}
                position="comment"
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
              />
            </Button>

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
                  <ReactionButton
                    pageId={pageId}
                    componentId={componentId}
                    myReaction={reactionByMe}
                    onReactionClick={handleReactionClick}
                    buttonClassName={styles.postComment__secondRow__like}
                    isCommentReaction
                    referenceType="comment"
                    community={community}
                  />
                  <Button
                    data-testid={`${pageId}/${componentId}/reply_button`}
                    variant="default"
                    onPress={() => handleReplyClick({ comment })}
                    className={styles.postComment__secondRow__replyButton}
                  >
                    <Typography.CaptionBold className={styles.postComment__secondRow__reply}>
                      Reply
                    </Typography.CaptionBold>
                  </Button>
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
                        community={community}
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
          </div>
        </div>
      )}
      {(comment.isDeleted ? hasClickLoadMore : !isEditing && showThread) && (
        <div className={styles.postComment__replyListWrapper}>
          <ReplyCommentList
            pageId={pageId}
            componentId={componentId}
            community={community ?? undefined}
            referenceId={comment.referenceId}
            referenceType={comment.referenceType}
            parentId={comment.commentId}
            l0AncestorId={comment.commentId}
            onClickReply={handleReplyClick}
            highlightedCommentId={
              effectiveIsL2Target ? parantId : isHighlightedReply ? highlightedCommentId : undefined
            }
            showReplyCommentAt={effectiveShowReplyCommentAt}
            highlightedL2CommentId={effectiveIsL2Target ? highlightedCommentId : undefined}
            renderInlineComposer={replyComposer ? () => replyComposer : undefined}
            inlineComposerAfterCommentId={replyTargetCommentId}
            initialPendingComments={pendingL1Comments}
            onEmpty={() => setHasClickLoadMore(false)}
          />
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
