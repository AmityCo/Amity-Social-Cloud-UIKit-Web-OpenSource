import React, { useEffect, useState } from 'react';

import { Typography } from '~/v4/core/components';
import { PostContent, PostContentSkeleton } from '~/v4/social/components/PostContent';
import { MenuButton } from '~/v4/social/elements/MenuButton';
import { PostMenu } from '~/v4/social/internal-components/PostMenu/PostMenu';
import usePost from '~/v4/core/hooks/objects/usePost';

import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import styles from './PostDetailPage.module.css';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { CommentComposer } from '~/v4/social/components/CommentComposer/CommentComposer';
import { CommentList } from '~/v4/social/components/CommentList/CommentList';
import {
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';

interface PostDetailPageProps {
  id: string;
  hideTarget?: boolean;
  category?: AmityPostCategory;
}

export function PostDetailPage({ id, hideTarget, category }: PostDetailPageProps) {
  const pageId = 'post_detail_page';
  const { post, isLoading: isPostLoading } = usePost(id);
  const { themeStyles } = useAmityPage({
    pageId,
  });
  const { onBack } = useNavigation();
  const [replyComment, setReplyComment] = useState<Amity.Comment | undefined>();

  const { setDrawerData, removeDrawerData } = useDrawer();

  const { community } = useCommunity({
    communityId: post?.targetType === 'community' ? post.targetId : null,
  });

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
              category={category ?? AmityPostCategory.GENERAL}
              style={AmityPostContentComponentStyle.DETAIL}
              hideTarget={hideTarget}
            />
          ) : null}
        </div>
        <div className={styles.postDetailPage__comments__divider} data-is-loading={isPostLoading} />
        <div className={styles.postDetailPage__comments}>
          {post && (
            <CommentList
              referenceId={post.postId}
              referenceType="post"
              onClickReply={(comment: Amity.Comment) => setReplyComment(comment)}
            />
          )}
        </div>
      </div>
      <div className={styles.postDetailPage__topBar}>
        <BackButton
          pageId={pageId}
          defaultClassName={styles.postDetailPage__backIcon}
          onPress={() => onBack()}
        />
        <Typography.Title className={styles.postDetailPage__topBar__title}>Post</Typography.Title>
        <div className={styles.postDetailPage__topBar__menuBar}>
          <MenuButton
            pageId={pageId}
            onClick={() =>
              setDrawerData({
                content: (
                  <PostMenu post={post} onCloseMenu={() => removeDrawerData()} pageId={pageId} />
                ),
              })
            }
          />
        </div>
      </div>
      {post?.targetType === 'community' && !community?.isJoined ? (
        <div>
          <div className={styles.postDetailPage__divider} />
          <Typography.Body className={styles.postDetailPage__notMember}>
            Join community to interact with all posts
          </Typography.Body>
        </div>
      ) : (
        post && (
          <CommentComposer
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
