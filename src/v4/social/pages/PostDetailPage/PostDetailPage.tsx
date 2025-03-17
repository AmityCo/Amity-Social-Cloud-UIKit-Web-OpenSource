import React, { useCallback, useEffect, useState } from 'react';
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

interface PostDetailPageProps {
  id: string;
  hideTarget?: boolean;
  category?: AmityPostCategory;
}

export function PostDetailPage({ id, hideTarget, category }: PostDetailPageProps) {
  const pageId = 'post_detail_page';

  const [replyComment, setReplyComment] = useState<Amity.Comment | undefined>();

  const { isDesktop } = useResponsive();
  const { onBack } = useNavigation();
  const { themeStyles } = useAmityPage({ pageId });
  const { post, refresh, isLoading: isPostLoading } = usePost(id);
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { community } = useCommunity({
    communityId: post?.targetType === 'community' ? post.targetId : null,
  });

  useEffect(() => {
    refresh();
  }, []);

  const handleReplyClick = useCallback(
    (comment: Amity.Comment) =>
      setReplyComment((prevComment) =>
        prevComment?.commentId === comment?.commentId ? undefined : comment,
      ),
    [],
  );

  const isNotJoinedCommunity = post?.targetType === 'community' && !community?.isJoined;

  return (
    <div className={styles.postDetailPage} style={themeStyles}>
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
          <div className={styles.postDetailPage__comments}>
            {post && (
              <CommentList
                pageId={pageId}
                referenceId={post.postId}
                referenceType="post"
                onClickReply={handleReplyClick}
                community={community}
                commentCount={post.commentsCount}
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
