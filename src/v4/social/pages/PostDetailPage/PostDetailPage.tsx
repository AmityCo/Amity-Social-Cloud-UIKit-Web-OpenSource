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
import { useSharableLink } from '~/v4/social/hooks/useSharableLink';
import { SharableModel } from '~/v4/utils/sharableLink';

export interface PostDetailPageProps {
  id: string;
  showBackButton?: boolean;
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
  showBackButton = true,
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
  const [deletedReplyError, setDeletedReplyError] = useState<string | null>(null);
  const commentListRef = useRef<HTMLDivElement>(null);

  // Deep-link resolution: an external comment link (/social/posts/:id?commentId=:id) carries
  // only the target commentId — no parentId/rootId. In-app navigation, by contrast, passes all
  // three. When only commentId is present, fetch the comment once and read its parentId/rootId
  // (both are native fields on the Amity comment model) so the rest of this page — hierarchy
  // computation, deleted-check, scroll/highlight — behaves identically to an in-app click.
  const isDeepLinkTarget = !!commentId && !parentId && !rootId;
  const [resolvedTarget, setResolvedTarget] = useState<{
    parentId?: string;
    rootId?: string;
  } | null>(null);
  const [isResolvingTarget, setIsResolvingTarget] = useState(isDeepLinkTarget);

  useEffect(() => {
    if (!isDeepLinkTarget || !commentId) {
      setIsResolvingTarget(false);
      return;
    }
    setIsResolvingTarget(true);
    setResolvedTarget(null);
    let unsubscribe: (() => void) | undefined;
    unsubscribe = CommentRepository.getComment(commentId, (resp) => {
      if (!resp.loading) {
        const target = resp.data as (Amity.Comment & { rootId?: string }) | null;
        if (target) {
          // For an L0 comment rootId equals its own id and parentId is undefined; the effective
          // computation below correctly treats that as a top-level target.
          setResolvedTarget({ parentId: target.parentId, rootId: target.rootId });
        }
        // Missing/deleted targets are surfaced by the checkDeleted effect below; either way we
        // stop resolving so the page falls back to post-top gracefully.
        setIsResolvingTarget(false);
        unsubscribe?.();
        unsubscribe = undefined;
      }
    });
    return () => unsubscribe?.();
  }, [isDeepLinkTarget, commentId]);

  // Prefer explicit props (in-app navigation); fall back to resolved deep-link values.
  const effectiveDirectParentId = parentId ?? resolvedTarget?.parentId;
  const effectiveRootId = rootId ?? resolvedTarget?.rootId;

  // Compute synchronously so CommentList gets the correct parentId on the very first render,
  // before the scroll/bounce timers fire.
  const effectiveParentId = !commentId
    ? undefined
    : !effectiveDirectParentId
      ? undefined // lv0: top-level comment
      : effectiveRootId && effectiveDirectParentId !== effectiveRootId
        ? effectiveRootId // lv2: reply-to-reply — anchor to L0
        : effectiveDirectParentId; // lv1 (or fallback when no rootId): direct reply to L0

  const hasShownReplyNotificationRef = useRef(false);

  const COMMENT_LIST_LIMIT = 20;

  const { isDesktop } = useResponsive();
  const { onBack, prevPage } = useNavigation();
  const notification = useNotifications();
  const { themeStyles } = useAmityPage({ pageId });
  const { post, refresh, isLoading: isPostLoading, error } = usePost(id);
  const { link: sharableLink } = useSharableLink({
    model: SharableModel.POST,
    referenceId: post?.postId,
  });
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
    hasShownReplyNotificationRef.current = false;
  }, [commentId]);

  // Show a toast when the targeted reply (or its L1 parent for L2 notifications) no longer exists.
  // Always checks commentId; for L2 notifications also checks parentId (the L1 parent).
  useEffect(() => {
    if (!commentId) return;
    // For deep links, wait until the hierarchy is resolved so the message wording (comment vs
    // reply) and the L2 parent check use the correct effective parent/root.
    if (isResolvingTarget) return;

    const isL2Notification =
      !!effectiveRootId && !!effectiveDirectParentId && effectiveDirectParentId !== effectiveRootId;

    const checkDeleted = (id: string, message: string): (() => void) | undefined => {
      if (community && !community?.isPublic && !community?.isJoined) return;
      let unsubscribe: (() => void) | undefined;
      unsubscribe = CommentRepository.getComment(id, (resp) => {
        if (!resp.loading) {
          unsubscribe?.();
          unsubscribe = undefined;
          const target = resp.data as Amity.Comment | null;
          if ((!target || target.isDeleted) && !hasShownReplyNotificationRef.current) {
            hasShownReplyNotificationRef.current = true;
            if (!isDesktop) {
              setDeletedReplyError('This reply is no longer available.');
            } else {
              notification.info({
                content: message,
                alignment: 'withSidebar',
              });
            }
          }
        }
      });
      return () => unsubscribe?.();
    };

    const isL0Comment = !effectiveDirectParentId;
    const commentMessage = isL0Comment
      ? 'This comment is no longer available.'
      : 'This reply is no longer available.';

    const cleanupComment = checkDeleted(commentId, commentMessage);
    const cleanupParent =
      isL2Notification && effectiveDirectParentId
        ? checkDeleted(effectiveDirectParentId, 'This reply is no longer available.')
        : undefined;

    return () => {
      cleanupComment?.();
      cleanupParent?.();
    };
  }, [commentId, effectiveDirectParentId, effectiveRootId, isResolvingTarget]);

  // Scrolling to the deep-link target is owned by CommentList, which renders the comment in its
  // natural position and scrolls to it once loaded (no pinning here).

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
        <div style={showBackButton ? undefined : { visibility: 'hidden', pointerEvents: 'none' }}>
          <BackButton
            pageId={pageId}
            defaultClassName={styles.postDetailPage__backIcon}
            onPress={handleBack}
          />
        </div>
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
                    sharableLink={sharableLink}
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
              sharableLink={sharableLink}
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
              highlightedCommentId={isResolvingTarget ? undefined : commentId}
              parentId={effectiveParentId}
              parantId={effectiveDirectParentId}
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
          externalError={deletedReplyError}
        />
      )}
    </div>
  );
}
