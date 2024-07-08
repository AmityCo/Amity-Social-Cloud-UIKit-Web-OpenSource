import React, { useState } from 'react';

import { Typography } from '~/v4/core/components';
import { PostContent, PostContentSkeleton } from '~/v4/social/components/PostContent';
import { MenuButton } from '~/v4/social/elements/MenuButton';
import { PostMenu } from '~/v4/social/internal-components/PostMenu/PostMenu';
import usePost from '~/v4/core/hooks/objects/usePost';

import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import styles from './PostDetailPage.module.css';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { PostCommentComposer } from '../../components/PostCommentComposer/PostCommentComposer';
import { PostCommentList } from '../../components/PostCommentList/PostCommentList';
import useCommentsCollection from '../../hooks/collections/useCommentsCollection';

interface PostDetailPageProps {
  id: string;
}

export function PostDetailPage({ id }: PostDetailPageProps) {
  const pageId = 'post_detail_page';
  const { post, isLoading: isPostLoading, error } = usePost(id);
  const { themeStyles } = useAmityPage({
    pageId,
  });
  const { onBack } = useNavigation();
  const [replyComment, setReplyComment] = useState<Amity.Comment>();

  const { setDrawerData, removeDrawerData } = useDrawer();

  return (
    <div className={styles.postDetailPage} style={themeStyles}>
      <div className={styles.postDetailPage__container}>
        <div className={styles.postDetailPage__postContent}>
          {isPostLoading ? (
            <PostContentSkeleton pageId={pageId} />
          ) : post ? (
            <PostContent pageId={pageId} post={post} type="detail" />
          ) : null}
        </div>
        <div className={styles.postDetailPage__comments__divider} data-is-loading={isPostLoading} />
        <div className={styles.postDetailPage__comments}>
          {post && (
            <PostCommentList
              post={post}
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
      {post && (
        <PostCommentComposer
          post={post}
          replyTo={replyComment}
          onCancelReply={() => setReplyComment(undefined)}
        />
      )}
    </div>
  );
}
