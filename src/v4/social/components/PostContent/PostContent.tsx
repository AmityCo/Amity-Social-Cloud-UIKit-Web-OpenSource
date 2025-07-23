import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { ReactionButton } from '~/v4/social/elements/ReactionButton';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import { ShareButton } from '~/v4/social/elements/ShareButton';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { Typography } from '~/v4/core/components';
import AngleRight from '~/v4/icons/AngleRight';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { CommentButton } from '~/v4/social/elements/CommentButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { PollContent } from './PollContent/PollContent';
import { TextContent } from './TextContent';
import { ImageContent } from './ImageContent';
import { VideoContent } from './VideoContent';
import { ClipContent } from './ClipContent';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { ImageViewer } from '~/v4/social/internal-components/ImageViewer/ImageViewer';
import { VideoViewer } from '~/v4/social/internal-components/VideoViewer/VideoViewer';
import { PostMenu } from '~/v4/social/internal-components/PostMenu/PostMenu';
import { usePostedUserInformation } from '~/v4/core/hooks/usePostedUserInformation';
import { Button } from '~/v4/core/natives/Button';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useVisibilitySensor } from '~/v4/social/hooks/useVisibilitySensor';
import { AnnouncementBadge } from '~/v4/social/elements/AnnouncementBadge';
import { PinBadge } from '~/v4/social/elements/PinBadge';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge';
import clsx from 'clsx';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';
import { LiveStreamContent } from './LiveStreamContent';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import styles from './PostContent.module.css';
import { isTextPost } from '~/v4/social/utils/postTypeChecker';
import { usePostReaction } from '~/v4/social/hooks/usePostReaction';
import { Comment, CommentSkeleton } from '~/v4/social/components/Comment';
import { Divider } from '~/v4/social/elements/Divider';
import { PostDetailPageProps } from '~/v4/social/pages/PostDetailPage/PostDetailPage';

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

interface PostTitleProps {
  post: Amity.Post;
  pageId?: string;
  componentId?: string;
  hideTarget?: boolean;
}

const PostTitle = ({ pageId, componentId, post, hideTarget }: PostTitleProps) => {
  const shouldCallCommunity = useMemo(() => post?.targetType === 'community', [post?.targetType]);
  const shouldCallUser = useMemo(
    () => post?.targetType === 'user' && post?.postedUserId !== post?.targetId,
    [post?.targetType, post?.postedUserId, post?.targetId],
  );

  const { community: targetCommunity } = useCommunity({
    communityId: post?.targetId,
    shouldCall: shouldCallCommunity,
  });

  const { user: targetUser } = useUser({
    userId: post?.targetId,
    shouldCall: shouldCallUser,
  });

  const { goToCommunityProfilePage, onClickUser } = useNavigation();

  const showTargetCommunity = targetCommunity && !hideTarget;
  const showTargetUser = targetUser && !hideTarget;
  const showBrandBadge = post?.creator?.isBrand;
  const showPrivateBadge = targetCommunity?.isPublic === false;
  const showOfficialBadge = targetCommunity?.isOfficial === true;

  const showTarget = showTargetCommunity || showTargetUser;

  return (
    <div className={styles.postTitle} data-show-target-community={showTargetCommunity === true}>
      {post && post?.creator && (
        <div
          className={styles.postTitle__user__container}
          data-show-brand-badge={showBrandBadge === true}
          data-show-target={showTarget === true}
        >
          <Button
            onPress={() => post?.creator?.userId && onClickUser(post.creator.userId)}
            data-testid={`${pageId}/${componentId}/username`}
          >
            <Typography.BodyBold className={styles.postTitle__text}>
              {post.creator.displayName}
            </Typography.BodyBold>
          </Button>
          {showBrandBadge ? <BrandBadge className={styles.postTitle__brandIcon} /> : null}
          {showTarget ? (
            <AngleRight
              data-testid={`${pageId}/${componentId}/arrow_right`}
              className={styles.postTitle__icon}
            />
          ) : null}
        </div>
      )}
      {showTargetCommunity && (
        <div
          className={styles.postTitle__community}
          data-show-private-badge={showPrivateBadge === true}
          data-show-official-badge={showOfficialBadge === true}
        >
          {showPrivateBadge && <CommunityPrivateBadge />}
          <Button
            className={styles.postTitle__communityText}
            data-testid={`${pageId}/${componentId}/community_name`}
            onPress={() => goToCommunityProfilePage(targetCommunity.communityId)}
          >
            <Typography.BodyBold>{targetCommunity.displayName}</Typography.BodyBold>
          </Button>
          {showOfficialBadge && <CommunityOfficialBadge />}
        </div>
      )}
      {showTargetUser && (
        <div
          className={styles.postTitle__user__container}
          data-show-brand-badge={targetUser?.isBrand === true}
          data-show-target={false}
        >
          <Button onPress={() => onClickUser(targetUser.userId)}>
            <Typography.BodyBold className={styles.postTitle__text}>
              {targetUser.displayName}
            </Typography.BodyBold>
          </Button>
          {targetUser?.isBrand === true ? (
            <BrandBadge className={styles.postTitle__brandIcon} />
          ) : null}
        </div>
      )}
    </div>
  );
};

type ChildrenPostContentProps = {
  pageId?: string;
  // Parent Post
  post: Amity.Post;
  componentId?: string;
  disabledContent?: boolean;
  onImageClick: (imageIndex: number) => void;
  onVideoClick: (videoIndex: number) => void;
  onClipClick: (postId: string) => void;
  goToPostDetail?: (
    context?: Pick<
      PostDetailPageProps,
      'commentId' | 'selectedReplyComment' | 'parentId' | 'showReplyCommentAt'
    >,
  ) => void;
};

export const ChildrenPostContent = ({
  post,
  pageId,
  componentId,
  onImageClick,
  onVideoClick,
  onClipClick,
  goToPostDetail,
  disabledContent = false,
}: ChildrenPostContentProps) => {
  return (
    <>
      <PollContent
        pageId={pageId}
        componentId={componentId}
        parentPost={post}
        posts={post.childrenPosts as Amity.Post<'poll'>[]}
        disabled={disabledContent}
      />
      <ImageContent
        pageId={pageId}
        componentId={componentId}
        posts={post.childrenPosts as Amity.Post<'image'>[]}
        onImageClick={onImageClick}
      />
      <VideoContent
        pageId={pageId}
        componentId={componentId}
        posts={post.childrenPosts as Amity.Post<'video'>[]}
        onVideoClick={onVideoClick}
      />
      <LiveStreamContent
        posts={post.childrenPosts as Amity.Post<'liveStream'>[]}
        goToPostDetail={goToPostDetail}
        parentPost={post}
      />
      <ClipContent
        pageId={pageId}
        componentId={componentId}
        posts={post.childrenPosts as Amity.Post<'clip'>[]}
        onClipClick={onClipClick}
      />
    </>
  );
};

interface PostContentProps {
  post: Amity.Post;
  onClick?: (
    context?: Pick<
      PostDetailPageProps,
      'commentId' | 'selectedReplyComment' | 'parentId' | 'showReplyCommentAt'
    >,
  ) => void;
  onPostDeleted?: (post: Amity.Post) => void;
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

    // Initial update
    updateLatestComment();

    // Set up an interval to check for changes (if SDK doesn't provide subscription)
    const interval = setInterval(updateLatestComment, 1000);

    return () => clearInterval(interval);
  }, [post.latestComments?.[0]?.updatedAt, post.latestComments[0]?.commentId]); // Only depend on postId to avoid infinite re-renders

  return { inlineComment, isLoading };
};

export const PostContent = ({
  pageId = '*',
  post,
  onClick,
  onPostDeleted,
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
  const { mutateAddReactionAsync, mutateRemoveReactionAsync, reactionByMe, reactionsCount } =
    usePostReaction({ post });

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

  const handleReactionClick = (reactionKey: string) => {
    if (reactionByMe) {
      mutateRemoveReactionAsync(reactionByMe);
    } else {
      mutateAddReactionAsync(reactionKey);
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

  const handleUnpinPost = async () => {};

  const handleEditPost = () => {};

  const handleDeletePost = () => {};

  const isNotJoinedCommunity = !targetCommunity?.isJoined && post?.targetType === 'community';

  const hasLike = post?.reactions?.like > 0;
  const hasLove = post?.reactions?.love > 0;
  const hasFire = post?.reactions?.fire > 0;
  const hasHappy = post?.reactions?.happy > 0;
  const hasCrying = post?.reactions?.crying > 0;

  const hasReaction = hasLike || hasLove || hasFire || hasHappy || hasCrying;

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
            <UserAvatar pageId={pageId} componentId={componentId} userId={post?.postedUserId} />
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
            {style === AmityPostContentComponentStyle.FEED && (
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
          <div className={styles.postContent__content}>
            <TextContent
              pageId={pageId}
              componentId={componentId}
              text={isTextPost(post) ? post?.data?.text : ''}
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
                disabledContent={isNotJoinedCommunity || disabledContent}
              />
            ) : null}
          </div>
          {isNotJoinedCommunity && page.type !== PageTypes.PostDetailPage ? (
            <>
              <div className={styles.postContent__divider} />
              <Typography.Body className={styles.postContent__notMember}>
                Join community to interact with all posts
              </Typography.Body>
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
                  <ShareButton pageId={pageId} componentId={componentId} />
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
