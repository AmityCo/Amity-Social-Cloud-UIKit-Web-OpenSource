import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import clsx from 'clsx';
import millify from 'millify';

import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import { usePostedUserInformation } from '~/v4/core/hooks/usePostedUserInformation';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import useSDK from '~/v4/core/hooks/useSDK';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import VideoControl from '~/v4/icons/VideoControl';
import { CommentComposer } from '~/v4/social/components/CommentComposer/CommentComposer';
import { CommentList } from '~/v4/social/components/CommentList/CommentList';
import { ReactionList } from '~/v4/social/components/ReactionList/ReactionList';
import { EventHostBadge } from '~/v4/social/elements';
import { AnnouncementBadge } from '~/v4/social/elements/AnnouncementBadge';
import { CommentButton } from '~/v4/social/elements/CommentButton';
import { Divider } from '~/v4/social/elements/Divider';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import { PinBadge } from '~/v4/social/elements/PinBadge';
import { ReactionButton } from '~/v4/social/elements/ReactionButton';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { ProductCarousel } from '~/v4/social/features/product-tagged/internal-components';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import useCommunity from '~/v4/social/hooks/objects/useCommunity';
import { usePost as usePostById } from '~/v4/social/hooks/posts/usePost';
import { usePostReaction } from '~/v4/social/hooks/usePostReaction';
import { useSharableLink } from '~/v4/social/hooks/useSharableLink';
import { useVisibilitySensor } from '~/v4/social/hooks/useVisibilitySensor';
import { ImageViewer } from '~/v4/social/internal-components/ImageViewer/ImageViewer';
import { PostMenu } from '~/v4/social/internal-components/PostMenu/PostMenu';
import { VideoViewer } from '~/v4/social/internal-components/VideoViewer/VideoViewer';
import type { PostDetailPageProps } from '~/v4/social/pages/PostDetailPage/PostDetailPage';
import { isTextPost } from '~/v4/social/utils/postTypeChecker';
import { getRepostedPostId } from '~/v4/social/utils/repost';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import { SharableModel } from '~/v4/utils/sharableLink';

import { ChildrenPostContent } from './ChildrenPostContent';
import styles from './PostContent.module.css';
import { PostTitle } from './PostTitle';
import { TextContent } from './TextContent';

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
      | 'commentId'
      | 'selectedReplyComment'
      | 'parentId'
      | 'showReplyCommentAt'
      | 'isFromCommentClick'
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
  expandAllContent?: boolean;
  eventCreatorId?: Amity.Event['userId'];
}

const getPostText = (post: Amity.Post): { title: string; text: string } => {
  if (!isTextPost(post)) return { title: '', text: '' };

  return {
    title: post.data?.title ?? '',
    text: post.data?.text ?? '',
  };
};

const RepostedPostReference = ({ postId, onClick }: { postId: string; onClick?: () => void }) => {
  const { post, isLoading } = usePostById({ postId, shouldCall: !!postId });

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onClick?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    onClick?.();
  };

  if (isLoading) {
    return (
      <div className={styles.postContent__repostReference}>
        <Typography.Caption className={styles.postContent__repostReference__status}>
          Loading original post...
        </Typography.Caption>
      </div>
    );
  }

  if (!post || post.isDeleted) {
    return (
      <div className={styles.postContent__repostReference}>
        <Typography.Caption className={styles.postContent__repostReference__status}>
          Original post is unavailable.
        </Typography.Caption>
      </div>
    );
  }

  const { title, text } = getPostText(post);
  const avatarUrl = post.creator?.avatar?.fileUrl
    ? getFileUrlWithSize(post.creator.avatar.fileUrl, 'small')
    : undefined;
  const avatarPlaceholder = (post.creator?.displayName || post.postedUserId).trim().charAt(0);
  const mediaPosts = (post.childrenPosts ?? []).filter(
    (childPost) => childPost.dataType === 'image' || childPost.dataType === 'video',
  );
  const mediaLeftCount = Math.max(0, mediaPosts.length - 4);

  return (
    <div
      className={styles.postContent__repostReference}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={styles.postContent__repostReference__header}>
        <div className={styles.postContent__repostReference__avatar}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className={styles.postContent__repostReference__avatarImage}
            />
          ) : (
            <Typography.CaptionBold
              className={styles.postContent__repostReference__avatarPlaceholder}
            >
              {avatarPlaceholder}
            </Typography.CaptionBold>
          )}
        </div>
        <div className={styles.postContent__repostReference__headerText}>
          <Typography.BodyBold className={styles.postContent__repostReference__author}>
            {post.creator?.displayName || post.postedUserId}
          </Typography.BodyBold>
          <Typography.Caption className={styles.postContent__repostReference__status}>
            Original post
          </Typography.Caption>
        </div>
      </div>
      {title && (
        <Typography.BodyBold className={styles.postContent__repostReference__text}>
          {title}
        </Typography.BodyBold>
      )}
      {text && (
        <Typography.Body className={styles.postContent__repostReference__text}>
          {text}
        </Typography.Body>
      )}
      {mediaPosts.length > 0 && (
        <div
          className={styles.postContent__repostReference__mediaGrid}
          data-media-amount={Math.min(mediaPosts.length, 4)}
        >
          {mediaPosts.slice(0, 4).map((mediaPost, index) => {
            const imageInfo =
              mediaPost.dataType === 'image'
                ? (mediaPost as Amity.Post<'image'>).getImageInfo()
                : undefined;
            const imageUrl = imageInfo?.fileUrl ? getFileUrlWithSize(imageInfo.fileUrl) : undefined;

            return (
              <div
                key={mediaPost.postId}
                className={styles.postContent__repostReference__mediaItem}
              >
                {imageUrl ? (
                  <img
                    loading="lazy"
                    src={imageUrl}
                    alt=""
                    className={styles.postContent__repostReference__mediaImage}
                  />
                ) : (
                  <div className={styles.postContent__repostReference__mediaPlaceholder} />
                )}
                {mediaPost.dataType === 'video' && (
                  <VideoControl className={styles.postContent__repostReference__mediaIcon} />
                )}
                {mediaLeftCount > 0 && index === 3 && (
                  <Typography.Headline className={styles.postContent__repostReference__mediaMore}>
                    +{mediaLeftCount}
                  </Typography.Headline>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
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
  expandAllContent = false,
  eventCreatorId,
}: PostContentProps) => {
  const componentId = 'post_content';
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();

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

  const { displaySocialReactions } = useCustomReaction();

  const canShowProductTags = !(post?.childrenPosts?.[0]?.dataType === 'room');

  // State to force poll results view when poll is closed from menu
  const [forceShowPollResults, setForceShowPollResults] = useState(false);

  // Inline reply state for the feed card. Mirrors PostDetailPage: top composer always shows
  // for new top-level comments; a separate reply composer renders right under the L0 ancestor
  // of whatever comment is being replied to (desktop). Mobile reuses the top composer in
  // reply mode (no second composer floating mid-list).
  const [replyTo, setReplyTo] = useState<Amity.Comment | undefined>(undefined);
  const [replyParentIdOverride, setReplyParentIdOverride] = useState<string | undefined>(undefined);
  const [replyL0AncestorId, setReplyL0AncestorId] = useState<string | undefined>(undefined);

  // Feed cards hide comments by default; the comment button / "N comments" label toggles
  // this to reveal the inline CommentList + composer (see design 802-9455). The post detail
  // page renders its own comment section and is unaffected (disabledInlineComment).
  const [showInlineComments, setShowInlineComments] = useState(false);

  const handleInlineReplyClick = useCallback(
    ({
      comment,
      parentIdOverride,
      l0AncestorId,
    }: {
      comment: Amity.Comment;
      parentIdOverride?: string;
      l0AncestorId?: string;
    }) => {
      setReplyTo((prev) => {
        const isToggleOff = prev?.commentId === comment.commentId;
        setReplyParentIdOverride(isToggleOff ? undefined : parentIdOverride);
        setReplyL0AncestorId(isToggleOff ? undefined : l0AncestorId);
        return isToggleOff ? undefined : comment;
      });
    },
    [],
  );

  const handleCancelInlineReply = useCallback(() => {
    setReplyTo(undefined);
    setReplyParentIdOverride(undefined);
    setReplyL0AncestorId(undefined);
  }, []);

  const handlePollClosed = useCallback(() => {
    setForceShowPollResults(true);
  }, []);

  const disabledInlineComment = pageId === 'post_detail_page' || pageId === 'pending_posts_page';

  const isModerator =
    (moderators || []).find((moderator) => moderator.userId === post.postedUserId) != null;

  const [isVideoViewerOpen, setIsVideoViewerOpen] = useState(false);
  const [clickedVideoIndex, setClickedVideoIndex] = useState<number | null>(null);

  const { page, goToClipFeedPage, goToPostDetailPage } = useNavigation();

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
  const repostedPostId = getRepostedPostId(post);

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
    if (targetCommunity)
      return handleCommunityProfileBehavior({
        defaultBehavior: () => onReactionClick(reactionKey),
        allowNonMember: false,
        isJoined: targetCommunity?.isJoined,
      });

    return handleUserProfileBehavior({
      defaultBehavior: () => onReactionClick(reactionKey),
      allowNonFollower: true,
    });
  };

  const onReactionListClick = () => {
    const reactionList = (
      <ReactionList pageId={pageId} referenceId={post.postId} referenceType={'post'} />
    );

    if (isDesktop) openPopup({ view: 'desktop', children: reactionList });
    else
      setDrawerData({
        content: reactionList,
        snapPoints: [0.7, 1],
        activeSnapPoint: 0.7,
      });
  };

  const handleReactionListClick = () => {
    if (targetCommunity)
      return handleCommunityProfileBehavior({
        defaultBehavior: onReactionListClick,
        allowNonMember: true,
        isJoined: targetCommunity?.isJoined,
      });

    return handleUserProfileBehavior({
      defaultBehavior: onReactionListClick,
      allowNonFollower: true,
    });
  };

  // Card-wide click navigates to post detail, but must yield to inner links/buttons
  // and to active text selection so URLs stay tappable and body text stays selectable.
  const handlePostBodyClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('a, button, input, textarea, [data-no-card-click]')) return;
    if (window.getSelection()?.toString()) return;
    onClick?.();
  };

  const handlePostBodyKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const handleCommentClick = (
    context: Pick<
      PostDetailPageProps,
      | 'commentId'
      | 'selectedReplyComment'
      | 'parentId'
      | 'showReplyCommentAt'
      | 'isFromCommentClick'
    >,
  ) => {
    if (targetCommunity)
      return handleCommunityProfileBehavior({
        defaultBehavior: () => {
          onClick?.(context);
        },
        allowNonMember: false,
        isJoined: targetCommunity?.isJoined,
      });

    handleUserProfileBehavior({
      defaultBehavior: () => {
        onClick?.(context);
      },
      allowNonFollower: true,
    });
  };

  // In the feed, the comment button / "N comments" label toggle the inline comment section
  // instead of navigating to the post detail page. Routed through the same community/follow
  // gating as handleCommentClick so non-members/visitors still get the join/follow prompt.
  const toggleInlineComments = () => {
    const defaultBehavior = () => setShowInlineComments((prev) => !prev);

    if (targetCommunity)
      return handleCommunityProfileBehavior({
        defaultBehavior,
        allowNonMember: false,
        isJoined: targetCommunity?.isJoined,
      });

    return handleUserProfileBehavior({ defaultBehavior, allowNonFollower: true });
  };

  const isFeedStyle = style === AmityPostContentComponentStyle.FEED;

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

  const { isVisitorOrBot } = useSDK();
  const canShowInlineComposer =
    !disabledInlineComment && !!post && !isNotJoinedCommunity && !isVisitorOrBot;

  const allConfigReactions = useMemo(
    () => displaySocialReactions.map((reactionConfigItem) => reactionConfigItem.name),
    [displaySocialReactions],
  );

  const configuredReactions = useMemo(() => {
    if (!displaySocialReactions || !post?.reactions) return [];

    return displaySocialReactions
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
  }, [displaySocialReactions, post?.reactions]);

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
  // Comments are hidden until the user opts in via the comment button (design 802-9455), so the
  // inline CommentList only mounts on demand. This also keeps SDK comment observers off posts the
  // user never expands (the concern the previous sticky-once-visible gate was added for).
  // `!!replyTo` keeps the section open while an inline reply is in progress.
  const shouldRenderInlineComments = showInlineComments || !!replyTo;

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
      <div ref={elementRef} className={clsx(styles.postContent)}>
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
              {eventCreatorId === post?.postedUserId ? (
                <div className={styles.postContent__bar__information__subtitle__moderator}>
                  <EventHostBadge withLabel />
                  <span className={styles.postContent__bar__information__subtitle__separator}>
                    •
                  </span>
                </div>
              ) : isCommunityModerator ? (
                <div className={styles.postContent__bar__information__subtitle__moderator}>
                  <ModeratorBadge pageId={pageId} componentId={componentId} />
                  <span className={styles.postContent__bar__information__subtitle__separator}>
                    •
                  </span>
                </div>
              ) : null}
              <Timestamp timestamp={post.createdAt} />
              {!post?.metadata?.hideEditedLabel && post.createdAt !== post.editedAt && (
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
                          community={targetCommunity}
                          componentId={componentId}
                          isSearchPost={isSearchPost}
                          onPostDeleted={onPostDeleted}
                          onPollClosed={handlePollClosed}
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
                          sharableLink={sharableLink}
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
                    community={targetCommunity}
                    isSearchPost={isSearchPost}
                    onPostDeleted={onPostDeleted}
                    onPollClosed={handlePollClosed}
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
                    sharableLink={sharableLink}
                  />
                )}
              </Popover>
            )}
          </div>
        </div>

        <div className={styles.postContent__content_and_reactions}>
          <div
            role="button"
            tabIndex={0}
            className={styles.postContent__content}
            onClick={handlePostBodyClick}
            onKeyDown={handlePostBodyKeyDown}
            data-testid={`${pageId}/${componentId}/post-content-text-button`}
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
              productTags={post?.productTags?.filter(
                (tag): tag is Amity.TextProductTag => 'index' in tag && 'length' in tag,
              )}
              post={post}
              keyword={keyword}
              isSearchPost={isSearchPost}
              isOpenSeeMore={expandAllContent}
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
                        targetId: post.targetId,
                        targetType: post.targetType,
                      });
                }}
                goToPostDetail={onClick}
                onPollPostDeleted={pageId === 'post_detail_page' ? onPollPostDeleted : undefined}
                forceShowPollResults={forceShowPollResults}
                expandAllContent={expandAllContent}
                community={targetCommunity}
              />
            ) : null}
            {repostedPostId && (
              <RepostedPostReference
                postId={repostedPostId}
                onClick={() => goToPostDetailPage({ postId: repostedPostId })}
              />
            )}
          </div>
          {canShowProductTags && (
            <ProductCarousel pageId={pageId} componentId={componentId} post={post} />
          )}

          <div className={styles.postContent__reactions_and_comments}>
            {post?.reactionsCount > 0 && (
              <Button
                data-testid={`${pageId}/${componentId}/post-content-reactions-button`}
                variant="default"
                className={styles.postContent__reactionsBar}
                onPress={handleReactionListClick}
              >
                {hasReaction ? (
                  <div className={styles.postContent__reactionsBar__reactions}>
                    {sortedReactions
                      .slice(0, 5)
                      .map((item) =>
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
              <Button
                data-testid={`${pageId}/${componentId}/comment_count`}
                variant="default"
                onPress={() => (isFeedStyle ? toggleInlineComments() : onClick?.())}
              >
                <Typography.Caption
                  data-testid={`${pageId}/${componentId}/comment_count`}
                  className={styles.postContent__commentsCount}
                >
                  {`${millify(post?.commentsCount) || 0} ${post?.commentsCount === 1 ? 'comment' : 'comments'}`}
                </Typography.Caption>
              </Button>
            )}
          </div>

          {/* Reaction Bar */}
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
                community={targetCommunity}
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
                onPress={() =>
                  isFeedStyle
                    ? toggleInlineComments()
                    : handleCommentClick({ isFromCommentClick: true })
                }
              />
            </div>
          </div>

          {isVideoViewerOpen && typeof clickedVideoIndex === 'number' ? (
            <VideoViewer
              post={post}
              onClose={closeVideoViewer}
              initialVideoIndex={clickedVideoIndex}
            />
          ) : null}
        </div>
      </div>
      {disabledInlineComment &&
        !(isNotJoinedCommunity && page.type !== PageTypes.PostDetailPage) && (
          <Divider className={styles.postContent__inlineComment__divider} />
        )}
      {/*
       * Should not see inline comment in post detail page and pending post page
       */}
      {!disabledInlineComment && shouldRenderInlineComments && (
        <>
          <Divider className={styles.postContent__inlineComment__divider} />
          {canShowInlineComposer && (
            <CommentComposer
              pageId={pageId}
              referenceId={post.postId}
              referenceType={'post'}
              // Desktop keeps the top composer for new top-level comments only; replies render
              // inline below the L0 (see renderReplyComment). Mobile shares this composer for
              // both new comments and replies (matches PostDetailPage's mobile UX).
              replyTo={isDesktop ? undefined : replyTo}
              parentIdOverride={isDesktop ? undefined : replyParentIdOverride}
              onCancelReply={handleCancelInlineReply}
              community={targetCommunity}
            />
          )}
          <div className={styles.postContent__inlineComment__container}>
            <CommentList
              pageId={pageId}
              referenceId={post.postId}
              referenceType="post"
              limit={3}
              community={targetCommunity}
              commentCount={post.commentsCount}
              eventCreatorId={eventCreatorId}
              hideEmptyState
              onClickReply={handleInlineReplyClick}
              replyTargetCommentId={
                isDesktop && replyL0AncestorId
                  ? replyParentIdOverride ?? replyTo?.commentId
                  : undefined
              }
              renderReplyComment={(comment) => {
                if (!isDesktop || !canShowInlineComposer) return undefined;
                const effectiveL0Id = replyL0AncestorId ?? replyTo?.commentId;
                if (replyTo && comment.commentId === effectiveL0Id) {
                  const composerMarginLeft = replyTo.parentId ? '2.5rem' : '0';
                  return (
                    <div style={{ marginLeft: composerMarginLeft }}>
                      <CommentComposer
                        pageId={pageId}
                        referenceId={post.postId}
                        referenceType={'post'}
                        replyTo={replyTo}
                        parentIdOverride={replyParentIdOverride}
                        onCancelReply={handleCancelInlineReply}
                        community={targetCommunity}
                      />
                    </div>
                  );
                }
                return undefined;
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};
