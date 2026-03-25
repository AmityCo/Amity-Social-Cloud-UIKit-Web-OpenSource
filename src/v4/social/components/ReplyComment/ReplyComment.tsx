import { CommentRepository } from '@amityco/ts-sdk';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
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
import { useUpdateComment } from '~/v4/social/hooks/useUpdateComment';
import { useReactionHandler } from '~/v4/core/hooks/useReactionHandler';
import { useCommentReaction } from '~/v4/social/hooks/useCommentReaction';
import { useCommentReactionDisplay } from '~/v4/social/hooks/useCommentReactionDisplay';
import { useDeleteComment } from '~/v4/social/hooks/useDeleteComment';
import { CommentReactionDisplay } from '~/v4/social/internal-components/CommentReactionDisplay/CommentReactionDisplay';
import { Button } from '~/v4/core/components/AriaButton';
import styles from './ReplyComment.module.css';
import { EVENT_LISTENER } from '~/v4/social/constants/eventListener';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';
import { useNetworkState } from 'react-use';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

type ReplyCommentProps = {
  pageId?: string;
  community?: Amity.Community;
  comment: Amity.Comment;
  isHighlightDeleted?: boolean;
  testId?: string;
  isL2?: boolean;

  l0AncestorId?: string;
  /** Called when the user taps the Reply button.
   *  @param comment          - The bubble that was tapped (for @mention pre-fill).
   *  @param parentIdOverride - Set only for L2 bubbles: the L1 comment ID to use as
   *                            parentId in the create-comment API call.
   *  @param l0AncestorId     - The L0 comment ID for desktop compose placement. */
  onClickReply?: (params: {
    comment: Amity.Comment;
    parentIdOverride?: string;
    l0AncestorId?: string;
  }) => void;
  /* Render prop for the L2 nested reply list. */
  renderL2ReplyList?: (props: {
    showL2Replies: boolean;
    pendingL2Comments: Amity.Comment[];
    hideL2Replies: () => void;
    hasViewRepliesBelow?: boolean;
  }) => React.ReactNode;
  showReply?: boolean;
  isHighlighted?: boolean;
};

const PostReplyComment = ({
  pageId = '*',
  community,
  comment,
  isHighlightDeleted = false,
  testId,
  isL2 = false,
  l0AncestorId,
  onClickReply,
  renderL2ReplyList,
  showReply = false,
  isHighlighted = false,
}: ReplyCommentProps) => {
  const componentId = 'post_comment';
  const { confirm } = useConfirmContext();
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { setDrawerData } = useDrawer();
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();

  const notification = useNotifications();
  const { online } = useNetworkState();
  const { page } = useNavigation();

  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityComponent({
      pageId,
      componentId,
    });

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [commentData, setCommentData] = useState<CreateCommentParams>();
  const [localCommentData, setLocalCommentData] = useState<{
    text: string;
    mentionees: Amity.UserMention[];
    metadata: Record<string, unknown>;
    links: Amity.Link[];
  } | null>(null);
  // Whether the L2 reply list is expanded (only relevant for L1 bubbles, i.e. isL2=false)
  const [showL2Replies, setShowL2Replies] = useState(false);
  // Set to true once the L2 list confirms it has no replies (all deleted).
  const [confirmedNoReplies, setConfirmedNoReplies] = useState(false);
  // Pending L2 comments captured before the L2 ReplyCommentList is mounted (first reply case).
  const [pendingL2Comments, setPendingL2Comments] = useState<Amity.Comment[]>([]);

  const replyChildrenCount = comment.childrenNumber ?? 0;

  useEffect(() => {
    if (!isL2) setShowL2Replies(showReply);
  }, [showReply, isL2]);

  // Stash the new L2 comment so it appears above the collapsed "View x replies" button
  // without auto-expanding the full list.
  useEffect(() => {
    if (isL2) return; // this is already an L2 bubble — no L3 nesting
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ parentId: string; comment: Amity.Comment }>).detail;
      if (detail.parentId !== comment.commentId) return;
      setPendingL2Comments((prev) =>
        prev.some((p) => p.commentId === detail.comment.commentId)
          ? prev
          : [detail.comment, ...prev],
      );
    };
    document.addEventListener(EVENT_LISTENER.REPLY_CREATED, handler);
    return () => document.removeEventListener(EVENT_LISTENER.REPLY_CREATED, handler);
  }, [comment.commentId, isL2]);

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

  const handleReplyClick = () => {
    if (!onClickReply) return;
    const handleReply = () => {
      if (isL2) {
        // L2 bubble → resolve L1 as parent for the API call.
        // parentIdOverride = comment.parentId (the L1 comment's ID).
        onClickReply({ comment, parentIdOverride: comment.parentId ?? undefined, l0AncestorId });
      } else {
        // L1 bubble → new reply becomes L2 under this L1.
        // parentIdOverride is undefined; CommentComposer will use replyTo.commentId.
        onClickReply({ comment, parentIdOverride: undefined, l0AncestorId });
      }
    };

    if (community)
      return handleCommunityProfileBehavior({
        defaultBehavior: handleReply,
        allowNonMember: false,
        isJoined: community?.isJoined,
      });

    handleUserProfileBehavior({
      defaultBehavior: handleReply,
      allowNonFollower: true,
    });
  };

  const isBrandUser = comment.creator?.isBrand ?? false;

  const toggleBottomSheet = () => setBottomSheetOpen((prev) => !prev);

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
      title: 'Delete reply',
      content: 'This reply will be permanently deleted.',
      cancelText: 'Cancel',
      okText: 'Delete',
      onOk: deleteComment,
    });
  };

  const { handleSaveComment } = useUpdateComment({
    commentId: comment.commentId,
    commentData,
    setIsEditing,
    onSuccess: (savedData) => {
      setLocalCommentData({
        text: (savedData.data as { text?: string })?.text ?? '',
        mentionees: (savedData.mentionees as Amity.UserMention[]) ?? [],
        metadata: savedData.metadata ?? {},
        links: savedData.links ?? [],
      });
    },
  });

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
                    text: localCommentData?.text ?? (comment.data as Amity.ContentDataText).text,
                  },
                  mentionees: (localCommentData?.mentionees ?? comment.mentionees) as Mentionees,
                  metadata: localCommentData?.metadata ?? comment.metadata ?? {},
                  links: localCommentData?.links ?? comment.links ?? [],
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
        <div className={styles.postReplyComment} style={themeStyles} data-testid={testId}>
          <UserAvatar pageId={pageId} componentId={componentId} userId={comment.userId} />
          <div className={styles.postReplyComment__details}>
            {/* l1Content: scopes the trunk ::before to L1 height only */}
            <div
              className={styles.postReplyComment__l1Content}
              data-show-l2={!isL2 && showL2Replies ? 'true' : 'false'}
              data-has-pending-l2={
                !isL2 && !showL2Replies && pendingL2Comments.length > 0 ? 'true' : 'false'
              }
              data-show-view-replies={
                !isL2 &&
                replyChildrenCount > 0 &&
                replyChildrenCount - pendingL2Comments.length > 0 &&
                !showL2Replies &&
                !confirmedNoReplies
                  ? 'true'
                  : 'false'
              }
            >
              <div
                data-has-reaction={reactionsCount > 0}
                className={clsx(
                  styles.postReplyComment__content,
                  isHighlighted && isL2 && styles.postReplyComment__contentHighlighted,
                )}
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
                  data={{
                    text: localCommentData?.text ?? (comment.data as Amity.ContentDataText).text,
                  }}
                  mentionees={
                    (localCommentData?.mentionees ?? comment.mentionees) as Amity.UserMention[]
                  }
                  metadata={localCommentData?.metadata ?? comment.metadata}
                  links={localCommentData?.links ?? comment.links}
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
                      {(localCommentData !== null || comment.createdAt !== comment.editedAt) &&
                        ' (edited)'}
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
                  {onClickReply && (
                    <Button
                      data-testid={`${pageId}/${componentId}/reply_button`}
                      variant="default"
                      onPress={handleReplyClick}
                      className={styles.postReplyComment__secondRow__replyButton}
                    >
                      <Typography.CaptionBold className={styles.postReplyComment__secondRow__reply}>
                        Reply
                      </Typography.CaptionBold>
                    </Button>
                  )}
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

              {/* Pending L2 comments — visible above "View x replies" */}
              {!isL2 &&
                !showL2Replies &&
                renderL2ReplyList?.({
                  showL2Replies: false,
                  pendingL2Comments,
                  hideL2Replies: () => {
                    setShowL2Replies(false);
                    setConfirmedNoReplies(true);
                  },
                  hasViewRepliesBelow:
                    replyChildrenCount > 0 &&
                    replyChildrenCount - pendingL2Comments.length > 0 &&
                    !confirmedNoReplies,
                })}

              {/* "View N replies" toggle — only shown on L1 bubbles (isL2=false) */}
              {!isL2 &&
                replyChildrenCount > 0 &&
                replyChildrenCount - pendingL2Comments.length > 0 &&
                !showL2Replies &&
                !confirmedNoReplies && (
                  <Button
                    variant="default"
                    data-testid={`${pageId}/${componentId}/view_l2_reply_button`}
                    className={styles.postReplyComment__viewReply_button}
                    onPress={() => setShowL2Replies(true)}
                  >
                    <Typography.CaptionBold className={styles.postReplyComment__viewReply_text}>
                      {(() => {
                        const count = Math.max(0, replyChildrenCount - pendingL2Comments.length);
                        return `View ${count} ${count > 1 ? 'replies' : 'reply'}`;
                      })()}
                    </Typography.CaptionBold>
                  </Button>
                )}
            </div>

            {/* L2 reply list (full, expanded): sibling of l1Content so trunk ::before stops at L1 height */}
            {!isL2 &&
              showL2Replies &&
              renderL2ReplyList?.({
                showL2Replies,
                pendingL2Comments,
                hideL2Replies: () => {
                  setShowL2Replies(false);
                  setConfirmedNoReplies(true);
                },
              })}
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
