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
import { PostStructureType } from '@amityco/ts-sdk';
import useSDK from '~/v4/core/hooks/useSDK';

export interface PostDetailPageProps {
  id: string;
  hideTarget?: boolean;
  category?: AmityPostCategory;
  commentId?: string;
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
  const [failedToShow, setFailedToShow] = useState(false);
  const commentListRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false); // Track if we've already scrolled to this commentId

  const { AmityPostDetailPageBehavior } = usePageBehavior();
  const { isDesktop } = useResponsive();
  const { onBack, prevPage } = useNavigation();
  const { themeStyles } = useAmityPage({ pageId });
  const { post, refresh, isLoading: isPostLoading, error } = usePost(id);
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { community } = useCommunity({
    communityId: post?.targetId,
    shouldCall: post?.targetType === 'community' && !!post?.targetId,
  });

  const isJoinedCommunity = post?.targetType === 'community' && community?.isJoined;
  const canSeeCommentComposer = post && isDesktop && isJoinedCommunity && !isVisitorOrBot;

  useEffect(() => {
    refresh();
    // This refresh will not work for desktop because the postId is not available yet when the page is mounted
  }, []);

  useEffect(() => {
    if (post?.postId !== id) {
      // When postId is undefined because the post is deleted, we need to refresh the page to get the latest data
      refresh();
    }
  }, []);

  // Add this useEffect to handle scrolling to comment when commentId is provided
  useEffect(() => {
    hasScrolledRef.current = false;

    // Only scroll if we haven't already and the comment list is available
    if (commentId && commentListRef.current && !hasScrolledRef.current) {
      // Mark that we're processing this scroll
      hasScrolledRef.current = true;

      // Create a custom event to signal when scrolling is complete
      const scrollCompleteEvent = new CustomEvent('comment-scroll-complete', {
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
    (comment: Amity.Comment) =>
      setReplyComment((prevComment) =>
        prevComment?.commentId === comment?.commentId ? undefined : comment,
      ),
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
    return <FailedToShow pageId={pageId} onBack={onBack} />;

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
            expandAllContent={isPollPost(post.childrenPosts[0])}
          />
        </div>
        {canSeeCommentComposer && (
          <CommentComposer
            pageId={pageId}
            referenceId={post.postId}
            referenceType={'post'}
            onCancelReply={() => setReplyComment(undefined)}
            community={community}
            containerClassName={
              post?.commentsCount <= 0 ? styles.postDetailPage__commentList__container : undefined
            }
            isFromCommentClick={isFromCommentClick}
          />
        )}
        {post?.commentsCount > 0 && (
          <div ref={commentListRef} className={styles.postDetailPage__comments}>
            {post && (
              <CommentList
                pageId={pageId}
                eventCreatorId={eventCreatorId}
                referenceId={post.postId}
                referenceType="post"
                onClickReply={handleReplyClick}
                community={community}
                commentCount={post.commentsCount}
                highlightedCommentId={commentId}
                parentId={parentId}
                showReplyCommentAt={showReplyCommentAt}
                renderReplyComment={(comment) => {
                  if (replyComment && comment.commentId === replyComment.commentId && isDesktop) {
                    return (
                      <CommentComposer
                        pageId={pageId}
                        referenceId={post.postId}
                        referenceType={'post'}
                        replyTo={replyComment}
                        onCancelReply={() => setReplyComment(undefined)}
                        community={community}
                        isFromCommentClick={isFromCommentClick}
                      />
                    );
                  }
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
