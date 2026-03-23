import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { ReactionButton } from '~/v4/social/elements/ReactionButton';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
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
import useCommunity from '~/v4/social/hooks/objects/useCommunity';
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
import { isEqual } from 'lodash';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';
import { EventHostBadge } from '~/v4/social/elements';
import { ProductCarousel } from '~/v4/social/features/product-tagged/internal-components';
import useProductCatalogueSettings from '~/v4/social/hooks/useProductCatalogueSettings';

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

const useInlineComment = ({ post, disabled }: { post: Amity.Post; disabled: boolean }) => {
  const inlineCommentRef = useRef<Amity.Comment | null>(null);
  const [inlineComment, setInlineComment] = useState<Amity.Comment | null>(null); // Add this back!
  const [isLoading, setIsLoading] = useState(true);

  const findLastestComment = useCallback((lastestComments: Amity.Comment[]) => {
    const sortedComments = [...(lastestComments || [])]
      .sort((a, b) => Date.parse(b?.createdAt || '') - Date.parse(a?.createdAt || ''))
      .filter((comment) => !comment?.flagCount && !comment?.isDeleted);

    return sortedComments?.[0] || null;
  }, []);

  useEffect(() => {
    if (disabled) return;

    const latestComments = post.latestComments;
    const newLatestComment = findLastestComment(latestComments as Amity.Comment[]);

    if (!latestComments || !newLatestComment) {
      setIsLoading(false);
      setInlineComment(null); // Clear the state as well
      inlineCommentRef.current = null;
      return;
    }

    if (!isEqual(inlineCommentRef.current, newLatestComment)) {
      inlineCommentRef.current = newLatestComment;
      setInlineComment(newLatestComment); // This triggers re-render!
    }

    setIsLoading(false);
  }, [post.latestComments, findLastestComment, disabled, post.postId]);

  return { inlineComment, isLoading }; // Return the state, not the ref
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
  const { goToCommunityProfilePage } = useNavigation();
  const { socialReactions } = useCustomReaction();
  const { productCatalogueSettings } = useProductCatalogueSettings();

  const canShowProductTags =
    productCatalogueSettings?.product.enabled && !(post?.childrenPosts?.[0]?.dataType === 'room');

  // State to force poll results view when poll is closed from menu
  const [forceShowPollResults, setForceShowPollResults] = useState(false);

  const handlePollClosed = useCallback(() => {
    setForceShowPollResults(true);
  }, []);

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
          <Button
            variant="default"
            className={styles.postContent__content}
            onPress={() => onClick?.()}
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
          </Button>
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
                onPress={() => onClick?.()}
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
                  onPress={() => handleCommentClick({ isFromCommentClick: true })}
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
                        elementId="copy_link_button"
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
      {!disabledInlineComment && (
        <>
          {loadingInlineComment ? (
            <CommentSkeleton pageId={pageId} componentId={componentId} />
          ) : (
            <>
              {inlineComment && (
                <>
                  <Divider className={styles.postContent__inlineComment__divider} />
                  <div
                    data-testid="post-inline-comment-button"
                    role="button"
                    tabIndex={0}
                    className={styles.postContent__inlineComment__container}
                    onClick={(e) => {
                      onClick?.({ commentId: inlineComment.commentId, isFromCommentClick: true });
                    }}
                  >
                    <Comment
                      isHost={eventCreatorId === inlineComment?.userId}
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
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
