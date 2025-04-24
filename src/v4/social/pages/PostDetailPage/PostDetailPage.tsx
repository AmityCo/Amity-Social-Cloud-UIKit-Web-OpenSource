import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Typography } from '~/v4/core/components';
import { PostContent, PostContentSkeleton } from '~/v4/social/components/PostContent';
import { PostMenu } from '~/v4/social/internal-components/PostMenu/PostMenu';
import usePost from '~/v4/core/hooks/objects/usePost';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { CommentComposer } from '~/v4/social/components/CommentComposer/CommentComposer';
import { CommentList } from '~/v4/social/components/CommentList/CommentList';
import {
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { Popover } from '~/v4/core/components/AriaPopover';
import styles from './PostDetailPage.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { ErrorPostDetail } from '~/v4/social/internal-components/ErrorPostDetail/ErrorPostDetail';
import { FailedToShow } from '~/v4/social/internal-components/FailedToShow';

interface PostDetailPageProps {
  id: string;
  hideTarget?: boolean;
  category?: AmityPostCategory;
  commentId?: string;
  parentId?: string;
}

export function PostDetailPage({
  id,
  hideTarget,
  category,
  commentId,
  parentId,
}: PostDetailPageProps) {
  const pageId = 'post_detail_page';

  const [replyComment, setReplyComment] = useState<Amity.Comment | undefined>();
  const commentListRef = useRef<HTMLDivElement>(null);

  const { isDesktop } = useResponsive();
  const { onBack } = useNavigation();
  const { themeStyles } = useAmityPage({ pageId });
  const { post, refresh, isLoading: isPostLoading, error } = usePost(id);
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { community } = useCommunity({
    communityId: post?.targetType === 'community' ? post.targetId : null,
  });

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
    if (commentId && commentListRef.current) {
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
          }, 150);

          // Clear inner timeout when we're done scrolling or if the component unmounts
          return () => clearTimeout(innerTimeout);
        }
      }, 300);

      // Clear outer timeout if the component unmounts
      return () => clearTimeout(outerTimeout);
    }
  }, [commentId, post, commentListRef.current]);

  const handleReplyClick = useCallback(
    (comment: Amity.Comment) =>
      setReplyComment((prevComment) =>
        prevComment?.commentId === comment?.commentId ? undefined : comment,
      ),
    [],
  );

  const isNotJoinedCommunity = post?.targetType === 'community' && !community?.isJoined;

  if (error || (post === null && !isPostLoading) || community?.isDeleted || post?.isDeleted)
    return <FailedToShow pageId={pageId} onBack={onBack} />;

  return (
    <div className={styles.postDetailPage} style={themeStyles}>
      <div className={styles.postDetailPage__topBar}>
        <BackButton
          pageId={pageId}
          defaultClassName={styles.postDetailPage__backIcon}
          onPress={() => onBack()}
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
                    onPostDeleted={() => onBack()}
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
              onPostDeleted={() => onBack()}
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
          {isPostLoading ? (
            <PostContentSkeleton pageId={pageId} />
          ) : post ? (
            <PostContent
              pageId={pageId}
              post={post}
              className={styles.postDetailPage__postContent}
              category={category ?? AmityPostCategory.GENERAL}
              style={AmityPostContentComponentStyle.DETAIL}
              hideTarget={hideTarget}
              disabledContent={isNotJoinedCommunity}
            />
          ) : null}
        </div>
        <div className={styles.postDetailPage__comments__divider} data-is-loading={isPostLoading} />
        {post && isDesktop && !isNotJoinedCommunity && (
          <CommentComposer
            pageId={pageId}
            referenceId={post.postId}
            referenceType={'post'}
            onCancelReply={() => setReplyComment(undefined)}
            community={community}
            containerClassName={
              post?.commentsCount <= 0 ? styles.postDetailPage__commentList__container : undefined
            }
          />
        )}
        {post?.commentsCount > 0 && (
          <div ref={commentListRef} className={styles.postDetailPage__comments}>
            {post && (
              <CommentList
                pageId={pageId}
                referenceId={post.postId}
                referenceType="post"
                onClickReply={handleReplyClick}
                community={community}
                commentCount={post.commentsCount}
                highlightedCommentId={commentId}
                parentId={parentId}
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
                      />
                    );
                  }
                }}
              />
            )}
          </div>
        )}
      </div>

      {post?.targetType === 'community' && !community?.isJoined ? (
        <div>
          <div className={styles.postDetailPage__divider} />
          <Typography.Body className={styles.postDetailPage__notMember}>
            Join community to interact with all posts
          </Typography.Body>
        </div>
      ) : (
        post &&
        !isDesktop && (
          <CommentComposer
            pageId={pageId}
            referenceId={post.postId}
            referenceType={'post'}
            replyTo={replyComment}
            onCancelReply={() => setReplyComment(undefined)}
            community={community}
          />
        )
      )}
    </div>
  );
}
