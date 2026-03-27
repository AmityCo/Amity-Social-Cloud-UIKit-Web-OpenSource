import { useCallback, useEffect, useState, useRef } from 'react';
import { Typography } from '~/v4/core/components';
import { PostContent, PostContentSkeleton } from '~/v4/social/components/PostContent';
import { PostMenu } from '~/v4/social/internal-components/PostMenu/PostMenu';
import usePost from '~/v4/core/hooks/objects/usePost';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { CommentComposer } from '~/v4/social/components/CommentComposer/CommentComposer';
import { CommentList } from '~/v4/social/components/CommentList/CommentList';
import {
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';
import useCommunity from '~/v4/social/hooks/objects/useCommunity';
import { Popover } from '~/v4/core/components/AriaPopover';
import styles from './PostDetailPage.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { FailedToShow } from '~/v4/social/internal-components/FailedToShow';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { isPollPost } from '~/v4/social/utils/postTypeChecker';
import { CommentRepository, PostStructureType } from '@amityco/ts-sdk';
import useSDK from '~/v4/core/hooks/useSDK';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { EVENT_LISTENER } from '~/v4/social/constants/eventListener';

export interface PostDetailPageProps {
  id: string;
  hideTarget?: boolean;
  category?: AmityPostCategory;
  commentId?: string;
  rootId?: string;
  parentId?: string;
  posts?: Amity.Post<'clip' | 'video'>[];
  selectedReplyComment?: Amity.Comment;
  showReplyCommentAt?: string;
  keyword?: string;
  isFromCommentClick?: boolean;
  eventCreatorId?: Amity.Event['userId'];
}

export interface GoToPostDetailPageParams extends Omit<PostDetailPageProps, 'id'> {
  postId: string;
}

export function PostDetailPage({
  id,
  hideTarget,
  category,
  commentId,
  rootId,
  parentId,
  posts = [],
  selectedReplyComment,
  showReplyCommentAt,
  keyword,
  isFromCommentClick = false,

  eventCreatorId,
}: PostDetailPageProps) {
  const pageId = 'post_detail_page';

  const { removeItem } = useGlobalFeedContext();
  const { isVisitorOrBot } = useSDK();

  const [replyComment, setReplyComment] = useState<Amity.Comment | undefined>(selectedReplyComment);
  const [replyParentIdOverride, setReplyParentIdOverride] = useState<string | undefined>(undefined);
  const [replyL0AncestorId, setReplyL0AncestorId] = useState<string | undefined>(undefined);
  const [failedToShow, setFailedToShow] = useState(false);
  const commentListRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  // Compute synchronously so CommentList gets the correct parentId on the very first render,
  // before the scroll/bounce timers fire.
  const effectiveParentId = !commentId
    ? undefined
    : !parentId
      ? undefined // lv0: top-level comment
      : rootId && parentId !== rootId
        ? rootId // lv2: reply-to-reply — anchor to L0
        : parentId; // lv1 (or fallback when no rootId): direct reply to L0

  const hasShownReplyNotificationRef = useRef(false);

  const COMMENT_LIST_LIMIT = 20;

  const { isDesktop } = useResponsive();
  const { onBack, prevPage } = useNavigation();
  const notification = useNotifications();
  const { themeStyles } = useAmityPage({ pageId });
  const { post, refresh, isLoading: isPostLoading, error } = usePost(id);
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { community } = useCommunity({
    communityId: post?.targetId,
    shouldCall: post?.targetType === 'community' && !!post?.targetId,
  });

  const isJoinedCommunity = post?.targetType === 'community' && community?.isJoined;
  const canSeeCommentComposer =
    post && (isJoinedCommunity || post?.targetType === 'user') && !isVisitorOrBot;

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (post?.postId !== id) {
      refresh();
    }
  }, []);

  useEffect(() => {
    hasScrolledRef.current = false;
    hasShownReplyNotificationRef.current = false;
  }, [commentId]);

  // Show a toast when the targeted reply (or its L1 parent for L2 notifications) no longer exists.
  // Always checks commentId; for L2 notifications also checks parentId (the L1 parent).
  useEffect(() => {
    if (!commentId) return;

    const isL2Notification = !!rootId && !!parentId && parentId !== rootId;

    const checkDeleted = (id: string): (() => void) | undefined => {
      if (community && !community?.isPublic && !community?.isJoined) return;
      let unsubscribe: (() => void) | undefined;
      unsubscribe = CommentRepository.getComment(id, (resp) => {
        if (!resp.loading) {
          unsubscribe?.();
          unsubscribe = undefined;
          const target = resp.data as Amity.Comment | null;
          if ((!target || target.isDeleted) && !hasShownReplyNotificationRef.current) {
            hasShownReplyNotificationRef.current = true;
            notification.info({
              content: 'This reply is no longer available.',
              alignment: 'withSidebar',
            });
          }
        }
      });
      return () => unsubscribe?.();
    };

    const cleanupComment = checkDeleted(commentId);
    const cleanupParent = isL2Notification ? checkDeleted(parentId) : undefined;

    return () => {
      cleanupComment?.();
      cleanupParent?.();
    };
  }, [commentId, parentId, rootId]);

  useEffect(() => {
    // Only scroll if we haven't already and the comment list is available
    if (commentId && commentListRef.current && !hasScrolledRef.current) {
      // Mark that we're processing this scroll
      hasScrolledRef.current = true;

      // Create a custom event to signal when scrolling is complete
      const scrollCompleteEvent = new CustomEvent(EVENT_LISTENER.SCROLL_COMPLETE, {
        bubbles: true,
        detail: { commentId },
      });

      // Wait for post content to load and DOM to fully update
      const outerTimeout = setTimeout(() => {
        if (commentListRef.current) {
          // First make sure the container is scrolled to the top
          const container = document.querySelector(`.${styles.postDetailPage__container}`);
          if (container) {
            container.scrollTo({
              top: 0,
              behavior: 'auto',
            });
          }

          // Then scroll to the comment with a small delay to ensure proper positioning
          const innerTimeout = setTimeout(() => {
            commentListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Wait for the smooth scroll animation to complete (approximately 500ms is typical)
            // before dispatching the event for the bounce animation
            const bounceTimeout = setTimeout(() => {
              document.dispatchEvent(scrollCompleteEvent);
            }, 500);

            // Clean up timeout if component unmounts
            return () => clearTimeout(bounceTimeout);
          }, 150);

          // Clear inner timeout when we're done scrolling or if the component unmounts
          return () => clearTimeout(innerTimeout);
        }
      }, 300);

      // Clear outer timeout if the component unmounts
      return () => clearTimeout(outerTimeout);
    }
  }, [commentId, post, commentListRef.current]);

  const handleBack = useCallback(() => {
    if (prevPage?.type === PageTypes.CreateLivestreamPage) onBack(2);
    else onBack();
  }, [prevPage?.type, onBack]);

  const handleReplyClick = useCallback(
    ({
      comment,
      parentIdOverride,
      l0AncestorId,
    }: {
      comment: Amity.Comment;
      parentIdOverride?: string;
      l0AncestorId?: string;
    }) => {
      setReplyComment((prevComment) =>
        prevComment?.commentId === comment?.commentId ? undefined : comment,
      );
      setReplyParentIdOverride(parentIdOverride);
      setReplyL0AncestorId(l0AncestorId);
    },
    [],
  );

  const handlePostDeleted = useCallback(
    (post: Amity.Post) => {
      removeItem(post.postId);
      handleBack();
    },
    [handleBack],
  );

  if (isPostLoading) {
    return <PostContentSkeleton pageId={pageId} />;
  }

  if (
    error ||
    (post === null && !isPostLoading) ||
    community?.isDeleted ||
    post?.isDeleted ||
    failedToShow ||
    post?.structureType === PostStructureType.AUDIO ||
    post?.structureType === PostStructureType.FILE ||
    post?.structureType === PostStructureType.MIXED
  )
    return <FailedToShow pageId={pageId} />;

  if (!post) return null;

  return (
    <div className={styles.postDetailPage} style={themeStyles}>
      <div className={styles.postDetailPage__topBar}>
        <BackButton
          pageId={pageId}
          defaultClassName={styles.postDetailPage__backIcon}
          onPress={handleBack}
        />
        <Typography.TitleBold
          data-testid={`${pageId}/page_title`}
          className={styles.postDetailPage__topBar__title}
        >
          Post
        </Typography.TitleBold>
        <Popover
          containerClassName={styles.postDetailPage__topBar__menuBar}
          trigger={{
            pageId,
            onClick: ({ closePopover }) =>
              setDrawerData({
                content: (
                  <PostMenu
                    post={post}
                    pageId={pageId}
                    onPostDeleted={handlePostDeleted}
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
              onPostDeleted={handlePostDeleted}
              onCloseMenu={() => {
                closePopover();
                removeDrawerData();
              }}
            />
          )}
        </Popover>
      </div>

      <div className={styles.postDetailPage__container}>
        <div>
          <PostContent
            pageId={pageId}
            post={post}
            eventCreatorId={eventCreatorId}
            className={styles.postDetailPage__postContent}
            category={category ?? AmityPostCategory.GENERAL}
            style={AmityPostContentComponentStyle.DETAIL}
            hideTarget={hideTarget}
            onPollPostDeleted={() => setFailedToShow(true)}
            expandAllContent
          />
        </div>
        {isDesktop && canSeeCommentComposer && (
          <CommentComposer
            pageId={pageId}
            referenceId={post.postId}
            referenceType={'post'}
            onCancelReply={() => {
              setReplyComment(undefined);
              setReplyParentIdOverride(undefined);
              setReplyL0AncestorId(undefined);
            }}
            community={community}
            containerClassName={
              post?.commentsCount <= 0 ? styles.postDetailPage__commentList__container : undefined
            }
            isFromCommentClick={isFromCommentClick}
          />
        )}
        <div ref={commentListRef} className={styles.postDetailPage__comments}>
          {post && (
            <CommentList
              pageId={pageId}
              eventCreatorId={eventCreatorId}
              referenceId={post.postId}
              referenceType="post"
              onClickReply={handleReplyClick}
              community={community}
              limit={COMMENT_LIST_LIMIT}
              commentCount={post.commentsCount}
              highlightedCommentId={commentId}
              parentId={effectiveParentId}
              parantId={parentId}
              showReplyCommentAt={showReplyCommentAt}
              replyTargetCommentId={
                replyL0AncestorId ? replyParentIdOverride ?? replyComment?.commentId : undefined
              }
              renderReplyComment={(comment) => {
                // For desktop: the inline compose bar is placed under the L0 comment that anchors the reply.
                // - When replying to L0 directly: effectiveL0Id = replyComment.commentId (= the L0 id itself)
                // - When replying to L1 or L2: replyL0AncestorId is set to the L0 id by handleReplyClick
                const effectiveL0Id = replyL0AncestorId ?? replyComment?.commentId;
                if (replyComment && comment.commentId === effectiveL0Id && isDesktop) {
                  const composerMarginLeft = replyComment.parentId ? '2.5rem' : '0';
                  return (
                    <div style={{ marginLeft: composerMarginLeft }}>
                      <CommentComposer
                        pageId={pageId}
                        referenceId={post.postId}
                        referenceType={'post'}
                        replyTo={replyComment}
                        parentIdOverride={replyParentIdOverride}
                        onCancelReply={() => {
                          setReplyComment(undefined);
                          setReplyParentIdOverride(undefined);
                          setReplyL0AncestorId(undefined);
                        }}
                        community={community}
                        isFromCommentClick={isFromCommentClick}
                      />
                    </div>
                  );
                }
              }}
            />
          )}
        </div>
      </div>
      {!isDesktop && canSeeCommentComposer && (
        <CommentComposer
          pageId={pageId}
          referenceId={post.postId}
          referenceType={'post'}
          onCancelReply={() => {
            setReplyComment(undefined);
            setReplyParentIdOverride(undefined);
            setReplyL0AncestorId(undefined);
          }}
          community={community}
          containerClassName={
            post?.commentsCount <= 0 ? styles.postDetailPage__commentList__container : undefined
          }
          isFromCommentClick={isFromCommentClick}
          replyTo={replyComment}
          parentIdOverride={replyParentIdOverride}
        />
      )}
    </div>
  );
}
