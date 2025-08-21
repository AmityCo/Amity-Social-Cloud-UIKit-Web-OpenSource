import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { ReactionButton } from '~/v4/social/elements/ReactionButton';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import { ShareButton } from '~/v4/social/elements/ShareButton';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { Typography } from '~/v4/core/components';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { CommentButton } from '~/v4/social/elements/CommentButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { TextContent } from './TextContent';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { ImageViewer } from '~/v4/social/internal-components/ImageViewer/ImageViewer';
import { VideoViewer } from '~/v4/social/internal-components/VideoViewer/VideoViewer';
import { PostMenu } from '~/v4/social/internal-components/PostMenu/PostMenu';
import { usePostedUserInformation } from '~/v4/core/hooks/usePostedUserInformation';
import millify from 'millify';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useVisibilitySensor } from '~/v4/social/hooks/useVisibilitySensor';
import { AnnouncementBadge } from '~/v4/social/elements/AnnouncementBadge';
import { PinBadge } from '~/v4/social/elements/PinBadge';
import clsx from 'clsx';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import styles from './PostContent.module.css';
import { isTextPost } from '~/v4/social/utils/postTypeChecker';
import { usePostReaction } from '~/v4/social/hooks/usePostReaction';
import { Share } from '~/v4/icons/Share';
import { IconButton } from '~/v4/core/components/IconButton';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { CopyLinkButton } from '~/v4/social/elements/CopyLinkButton';
import { PostTitle } from './PostTitle';
import { ChildrenPostContent } from './ChildrenPostContent';
import { SharableModel } from '~/v4/utils/sharableLink';
import { Comment, CommentSkeleton } from '~/v4/social/components/Comment';
import { Divider } from '~/v4/social/elements/Divider';
import { PostDetailPageProps } from '~/v4/social/pages/PostDetailPage/PostDetailPage';
import { ReactionList } from '~/v4/social/components/ReactionList/ReactionList';
import { useSharableLink } from '~/v4/social/hooks/useSharableLink';
import { Button } from '~/v4/core/components/AriaButton';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';

export enum AmityPostContentComponentStyle {
  FEED = 'feed',
  DETAIL = 'detail',
}

export enum AmityPostCategory {
  GENERAL = 'general',
  ANNOUNCEMENT = 'announcement',
  PIN = 'pin',
  PIN_AND_ANNOUNCEMENT = 'pin_and_announcement',
}

interface PostContentProps {
  post: Amity.Post;
  onClick?: (
    context?: Pick<
      PostDetailPageProps,
      'commentId' | 'selectedReplyComment' | 'parentId' | 'showReplyCommentAt'
    >,
  ) => void;
  onPostDeleted?: (post: Amity.Post) => void;
  onPollPostDeleted?: (post: Amity.Post) => void;
  style: AmityPostContentComponentStyle;
  category: AmityPostCategory;
  hideMenu?: boolean;
  hideTarget?: boolean;
  pageId?: string;
  disabledContent?: boolean;
  isGlobalFeaturePost?: boolean;
  className?: string;
  keyword?: string;
  isSearchPost?: boolean;
}

const useInlineComment = ({ post, disabled }: { post: Amity.Post; disabled: boolean }) => {
  const [inlineComment, setInlineComment] = useState<Amity.Comment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (disabled) return;

    const updateLatestComment = () => {
      const sortedComments = [...(post.latestComments || [])]
        .sort((a, b) => Date.parse(b?.createdAt || '') - Date.parse(a?.createdAt || ''))
        .filter((comment) => !comment?.flagCount && !comment?.isDeleted);

      const newLatestComment = sortedComments?.[0] || null;
      setInlineComment(newLatestComment);
      setIsLoading(false);
    };

    updateLatestComment();
  }, [post.latestComments?.[0]?.updatedAt, post.latestComments[0]?.commentId]);

  return { inlineComment, isLoading };
};

export const PostContent = ({
  pageId = '*',
  post,
  onClick,
  onPostDeleted,
  onPollPostDeleted,
  category,
  hideMenu = false,
  hideTarget = false,
  style,
  disabledContent = false,
  isGlobalFeaturePost = false,
  className,
  keyword,
  isSearchPost = false,
}: PostContentProps) => {
  const componentId = 'post_content';

  const { themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { confirm } = useConfirmContext();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { moderators } = useCommunityModeratorsCollection({ communityId: post?.targetId });
  const {
    mutateAddReactionAsync,
    mutateRemoveReactionAsync,
    reactionByMe,
    setReactionByMe,
    reactionsCount,
  } = usePostReaction({ post });
  const { goToCommunityProfilePage } = useNavigation();
  const { socialReactions } = useCustomReaction();

  const disabledInlineComment = pageId === 'post_detail_page' || pageId === 'pending_posts_page';

  const { inlineComment, isLoading: loadingInlineComment } = useInlineComment({
    post,
    disabled: disabledInlineComment,
  });

  const isModerator =
    (moderators || []).find((moderator) => moderator.userId === post.postedUserId) != null;

  const [isVideoViewerOpen, setIsVideoViewerOpen] = useState(false);
  const [clickedVideoIndex, setClickedVideoIndex] = useState<number | null>(null);

  const { page, goToClipFeedPage } = useNavigation();

  const elementRef = useRef<HTMLDivElement>(null);

  const shouldCall = useMemo(() => post?.targetType === 'community', [post?.targetType]);

  const { community: targetCommunity } = useCommunity({
    communityId: post?.targetId,
    shouldCall,
  });

  const { isCommunityModerator } = usePostedUserInformation({
    post,
    community: targetCommunity,
  });

  const { link: sharableLink } = useSharableLink({
    model: SharableModel.POST,
    referenceId: post.postId,
  });

  const handleReactionClick = async (reactionKey: string) => {
    if (reactionByMe === null) {
      await mutateAddReactionAsync(reactionKey);
    } else if (reactionByMe !== reactionKey) {
      await mutateRemoveReactionAsync(reactionByMe);
      await mutateAddReactionAsync(reactionKey);
    } else {
      await mutateRemoveReactionAsync(reactionByMe);
    }
  };

  const openImageViewer = (imageIndex: number) => {
    openPopup({
      id: 'image-viewer',
      disabledAnimation: true,
      isDismissable: isDesktop,
      className: styles.postContent__imageViewer,
      overlayClassName: styles.postContent__imageViewerOverlay,
      children: (
        <ImageViewer post={post} onClose={closeImageViewer} initialImageIndex={imageIndex} />
      ),
    });
  };

  const closeImageViewer = () => {
    closePopup('image-viewer');
  };

  const openVideoViewer = (imageIndex: number) => {
    setIsVideoViewerOpen(true);
    setClickedVideoIndex(imageIndex);
  };

  const closeVideoViewer = () => {
    setIsVideoViewerOpen(false);
    setClickedVideoIndex(null);
  };

  const onEditFeaturePost = ({ onConfirm }: { onConfirm: () => void }) => {
    confirm({
      title: 'Edit globally featured post?',
      content: `The post you're editing has been featured globally. If you edit your post, it will need to be re-approved and will no longer be globally featured.`,
      cancelText: 'Cancel',
      okText: 'Edit',
      onOk: onConfirm,
    });
  };

  const isNotJoinedCommunity = !targetCommunity?.isJoined && post?.targetType === 'community';

  const allConfigReactions = useMemo(
    () => socialReactions.map((reactionConfigItem) => reactionConfigItem.name),
    [socialReactions],
  );

  const configuredReactions = useMemo(() => {
    if (!socialReactions || !post?.reactions) return [];

    return socialReactions
      .filter((reaction) => post.reactions[reaction.name] > 0)
      .sort((a, b) => {
        const countA = post.reactions[a.name] || 0;
        const countB = post.reactions[b.name] || 0;

        // First sort by count (descending)
        if (countB !== countA) {
          return countB - countA;
        }

        // If counts are equal, sort alphabetically by reaction name (ascending)
        return a.name.localeCompare(b.name);
      });
  }, [socialReactions, post?.reactions]);

  const unknownReactions = useMemo(() => {
    if (!post?.reactions) return [];

    return Object.keys(post.reactions).filter(
      (reactionType) =>
        !allConfigReactions.includes(reactionType) && post.reactions[reactionType] > 0,
    );
  }, [post?.reactions, allConfigReactions]);

  const sortedReactions = useMemo(() => {
    if (!post?.reactions) return [];

    // Combine configured and unknown reactions with their counts
    const allReactions = [
      ...configuredReactions.map((reaction) => ({
        type: 'configured' as const,
        reaction,
        count: post.reactions[reaction.name] || 0,
      })),
      ...unknownReactions.map((reactionName) => ({
        type: 'unknown' as const,
        reactionName,
        count: post.reactions[reactionName] || 0,
      })),
    ];

    return allReactions.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      const nameA = a.type === 'configured' ? a.reaction.name : a.reactionName;
      const nameB = b.type === 'configured' ? b.reaction.name : b.reactionName;
      return nameA.localeCompare(nameB);
    });
  }, [configuredReactions, unknownReactions, post?.reactions]);

  const hasReaction = sortedReactions.length > 0;

  //TODO: check needApprovalOnPostCreation and onlyAdminCanPost after postSetting fix from SDK
  const shouldShowConfirmEdit =
    !isModerator &&
    isGlobalFeaturePost &&
    ((targetCommunity as Amity.Community & { needApprovalOnPostCreation?: boolean })
      ?.needApprovalOnPostCreation ||
      targetCommunity?.postSetting === 'ADMIN_REVIEW_POST_REQUIRED');

  const { isVisible } = useVisibilitySensor({
    threshold: 0.6,
    elementRef,
  });

  useEffect(() => {
    if (page.type === PageTypes.PostDetailPage) return;
    if (isVisible) {
      post.analytics?.markAsViewed();
    }
  }, [post, isVisible, page.type]);

  return (
    <div
      data-testid={accessibilityId}
      style={themeStyles}
      className={clsx(styles.postContent__container, className)}
    >
      <div ref={elementRef} className={clsx(styles.postContent, className)}>
        {(category === AmityPostCategory.ANNOUNCEMENT ||
          category === AmityPostCategory.PIN_AND_ANNOUNCEMENT) && (
          <AnnouncementBadge pageId={pageId} componentId={componentId} />
        )}
        <div className={styles.postContent__bar} data-type={style}>
          <div className={styles.postContent__bar__userAvatar}>
            <UserAvatar
              pageId={pageId}
              componentId={componentId}
              userId={post?.postedUserId}
              shouldRedirectToUserProfile
            />
          </div>
          <div className={styles.postContent__bar__detail}>
            <div>
              <PostTitle
                post={post}
                hideTarget={hideTarget}
                pageId={pageId}
                componentId={componentId}
              />
            </div>
            <div className={styles.postContent__bar__information__subtitle}>
              {isCommunityModerator ? (
                <div className={styles.postContent__bar__information__subtitle__moderator}>
                  <ModeratorBadge pageId={pageId} componentId={componentId} />
                  <span className={styles.postContent__bar__information__subtitle__separator}>
                    •
                  </span>
                </div>
              ) : null}
              <Timestamp timestamp={post.createdAt} />
              {post.createdAt !== post.editedAt && (
                <Typography.Caption
                  data-testid={`${pageId}/${componentId}/post_edited_text`}
                  className={styles.postContent__bar__information__editedTag}
                >
                  (edited)
                </Typography.Caption>
              )}
            </div>
          </div>

          <div className={styles.postContent__wrapRightMenu}>
            {(category === AmityPostCategory.PIN ||
              category === AmityPostCategory.PIN_AND_ANNOUNCEMENT) && (
              <PinBadge pageId={pageId} componentId={componentId} />
            )}
            {style === AmityPostContentComponentStyle.FEED && sharableLink && (
              <Popover
                containerClassName={styles.postContent__bar__actionButton}
                trigger={{
                  pageId,
                  componentId,
                  onClick: ({ closePopover }) =>
                    setDrawerData({
                      content: (
                        <PostMenu
                          post={post}
                          pageId={pageId}
                          componentId={componentId}
                          isSearchPost={isSearchPost}
                          onPostDeleted={onPostDeleted}
                          onConfirmEditPost={
                            shouldShowConfirmEdit
                              ? ({ onConfirm }) => {
                                  closePopover();
                                  removeDrawerData();
                                  onEditFeaturePost({ onConfirm });
                                }
                              : undefined
                          }
                          onCloseMenu={() => {
                            closePopover();
                            removeDrawerData();
                          }}
                        />
                      ),
                    }),
                }}
              >
                {({ closePopover }) => (
                  <PostMenu
                    post={post}
                    pageId={pageId}
                    componentId={componentId}
                    isSearchPost={isSearchPost}
                    onPostDeleted={onPostDeleted}
                    onConfirmEditPost={
                      shouldShowConfirmEdit
                        ? ({ onConfirm }) => {
                            closePopover();
                            removeDrawerData();
                            onEditFeaturePost({ onConfirm });
                          }
                        : undefined
                    }
                    onCloseMenu={() => {
                      closePopover();
                      removeDrawerData();
                    }}
                  />
                )}
              </Popover>
            )}
          </div>
        </div>

        <div className={styles.postContent__content_and_reactions}>
          <Button
            variant="default"
            className={styles.postContent__content}
            onPress={() => onClick?.()}
          >
            <TextContent
              pageId={pageId}
              componentId={componentId}
              text={isTextPost(post) ? post?.data?.text : ''}
              title={isTextPost(post) ? post?.data?.title ?? '' : ''}
              mentioned={post?.metadata?.mentioned}
              mentionees={post?.mentionees}
              hashtagged={post?.metadata?.hashtags}
              hashtags={post?.hashtags}
              post={post}
              keyword={keyword}
              isSearchPost={isSearchPost}
            />
            {post.childrenPosts?.length > 0 ? (
              <ChildrenPostContent
                pageId={pageId}
                componentId={componentId}
                post={post}
                onImageClick={openImageViewer}
                onVideoClick={openVideoViewer}
                onClipClick={() => {
                  isDesktop
                    ? openVideoViewer(0)
                    : goToClipFeedPage?.({
                        currentPostId: post.children[0],
                      });
                }}
                goToPostDetail={onClick}
                onPollPostDeleted={pageId === 'post_detail_page' ? onPollPostDeleted : undefined}
                disabledContent={isNotJoinedCommunity || disabledContent}
              />
            ) : null}
          </Button>

          <div className={styles.postContent__reactions_and_comments}>
            {post?.reactionsCount > 0 && (
              <Button
                variant="default"
                className={styles.postContent__reactionsBar}
                onPress={() => {
                  const reactionList = (
                    <ReactionList
                      pageId={pageId}
                      referenceId={post.postId}
                      referenceType={'post'}
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
              >
                {hasReaction ? (
                  <div className={styles.postContent__reactionsBar__reactions}>
                    {sortedReactions.map((item) =>
                      item.type === 'configured' ? (
                        <img
                          key={item.reaction.name}
                          src={item.reaction.image}
                          alt={item.reaction.name}
                          className={styles.postContent__reactionsBar__reactions__icon}
                        />
                      ) : (
                        <FallbackReaction
                          key={item.reactionName}
                          className={clsx(
                            styles.postContent__reactionsBar__reactions__iconFallback,
                            styles.postContent__reactionsBar__reactions__icon,
                          )}
                          backgroundColor={getComputedStyle(
                            document.documentElement,
                          ).getPropertyValue('--asc-color-base-shade3')}
                        />
                      ),
                    )}
                  </div>
                ) : null}

                <Typography.Caption
                  data-testid={`${pageId}/${componentId}/like_count`}
                  className={styles.postContent__reactionsBar__reactions__count}
                >
                  {`${millify(post?.reactionsCount || 0)}`}
                </Typography.Caption>
              </Button>
            )}

            {post?.commentsCount > 0 && (
              <Button variant="default" onPress={() => onClick?.()}>
                <Typography.Caption
                  data-testid={`${pageId}/${componentId}/comment_count`}
                  className={styles.postContent__commentsCount}
                >
                  {`${millify(post?.commentsCount) || 0} ${post?.commentsCount === 1 ? 'comment' : 'comments'}`}
                </Typography.Caption>
              </Button>
            )}
          </div>

          {isNotJoinedCommunity && page.type !== PageTypes.PostDetailPage ? (
            <>
              <div className={styles.postContent__divider} />
              <Button variant="default" onPress={() => goToCommunityProfilePage(post.targetId)}>
                <Typography.Body className={styles.postContent__notMember}>
                  Join community to interact with all posts
                </Typography.Body>
              </Button>
            </>
          ) : targetCommunity &&
            !targetCommunity?.isJoined &&
            page.type === PageTypes.PostDetailPage ? null : (
            <>
              <div className={styles.postContent__divider} />
              <div className={styles.postContent__reactionBar}>
                <div className={styles.postContent__reactionBar__leftPane}>
                  <ReactionButton
                    pageId={pageId}
                    componentId={componentId}
                    reactionsCount={
                      style === AmityPostContentComponentStyle.FEED ? reactionsCount : undefined
                    }
                    myReaction={reactionByMe}
                    defaultIconClassName={styles.postContent__reactionBar__leftPane__icon}
                    imgIconClassName={styles.postContent__reactionBar__leftPane__iconImg}
                    onReactionClick={handleReactionClick}
                  />
                  <CommentButton
                    pageId={pageId}
                    componentId={componentId}
                    commentsCount={
                      style === AmityPostContentComponentStyle.FEED ? post.commentsCount : undefined
                    }
                    buttonClassName={styles.postContent__reactionBar__leftPane__commentButton}
                    defaultIconClassName={styles.postContent__reactionBar__leftPane__icon}
                    imgIconClassName={styles.postContent__reactionBar__leftPane__iconImg}
                    onPress={() => onClick?.()}
                  />
                </div>
                <div className={styles.postContent__reactionBar__rightPane}>
                  {(!targetCommunity || targetCommunity?.isPublic) && (
                    <Popover
                      containerClassName={styles.postContent__bar__actionButton}
                      trigger={({ openPopover }) => (
                        <IconButton
                          variant="text"
                          pageId={pageId}
                          componentId={componentId}
                          defaultIcon={<Share className={styles.postContent__shareIcon} />}
                          onPress={() =>
                            isDesktop
                              ? openPopover()
                              : setDrawerData({
                                  content: (
                                    <CopyLinkButton
                                      pageId={pageId}
                                      componentId={componentId}
                                      model={SharableModel.POST}
                                      referenceId={post.postId}
                                      onDone={removeDrawerData}
                                    />
                                  ),
                                })
                          }
                        />
                      )}
                    >
                      {({ closePopover }) => (
                        <CopyLinkButton
                          pageId={pageId}
                          componentId={componentId}
                          model={SharableModel.POST}
                          referenceId={post.postId}
                          onDone={isDesktop ? closePopover : removeDrawerData}
                        />
                      )}
                    </Popover>
                  )}
                </div>
              </div>
            </>
          )}
          {isVideoViewerOpen && typeof clickedVideoIndex === 'number' ? (
            <VideoViewer
              post={post}
              onClose={closeVideoViewer}
              initialVideoIndex={clickedVideoIndex}
            />
          ) : null}
        </div>
      </div>
      {/*
       * Should not see inline comment in post detail page and pending post page
       */}
      {!disabledInlineComment && (
        <>
          <Divider className={styles.postContent__inlineComment__divider} />
          {loadingInlineComment ? (
            <CommentSkeleton pageId={pageId} componentId={componentId} />
          ) : (
            <>
              {inlineComment && (
                <Button
                  variant="default"
                  className={styles.postContent__inlineComment__container}
                  onPress={() => onClick?.({ commentId: inlineComment.commentId })}
                >
                  <Comment
                    key={inlineComment?.commentId} // Add key to force proper re-rendering
                    pageId={pageId}
                    comment={inlineComment}
                    onClickReply={() => {
                      onClick?.({
                        commentId: inlineComment?.commentId,
                        parentId: inlineComment?.parentId,
                        selectedReplyComment: inlineComment!,
                      });
                    }}
                    onClickShowReply={() => {
                      onClick?.({
                        commentId: inlineComment?.commentId,
                        showReplyCommentAt: inlineComment?.commentId,
                      });
                    }}
                    componentId={componentId}
                    // hide option buttion for inline comment
                    hideOptionButton={true}
                    community={targetCommunity}
                    maxLines={3}
                  />
                </Button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
