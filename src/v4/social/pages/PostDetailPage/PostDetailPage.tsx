import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CommentRepository } from '@amityco/ts-sdk';

import { Typography } from '~/v4/core/components';
import { PostContent, PostContentSkeleton } from '~/v4/social/components/PostContent';
import { MenuButton } from '~/v4/social/elements/MenuButton';
import { PostMenu } from '~/v4/social/internal-components/PostMenu/PostMenu';
import usePost from '~/v4/core/hooks/objects/usePost';

import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import CommentList from '~/v4/social/internal-components/CommentList/CommentList';
import CommentComposeBar from '~/v4/social/internal-components/CommentComposeBar/CommentComposeBar';
import { Mentionees, Metadata } from '~/v4/helpers/utils';
import styles from './PostDetailPage.module.css';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';

interface PostDetailPageProps {
  id: string;
}

export function PostDetailPage({ id }: PostDetailPageProps) {
  const pageId = 'post_detail_page';
  const { post, isLoading: isPostLoading, error } = usePost(id);
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityPage({
      pageId,
    });
  const { onBack } = useNavigation();
  const [replyComment, setReplyComment] = useState<Amity.Comment | null>(null);

  const { setDrawerData, removeDrawerData } = useDrawer();

  const { mutateAsync } = useMutation({
    mutationFn: async ({
      text,
      mentionees,
      metadata,
    }: {
      text: string;
      mentionees: Mentionees;
      metadata: Metadata;
    }) => {
      const referenceId = replyComment ? replyComment.referenceId : post?.postId;
      const referenceType = replyComment ? replyComment.referenceType : 'post';
      const parentId = replyComment ? replyComment.commentId : undefined;

      await CommentRepository.createComment({
        referenceId,
        referenceType,
        data: {
          text: text,
        },
        parentId,
        metadata,
        mentionees: mentionees as Amity.UserMention[],
      });
    },
  });

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
          <CommentList
            referenceId={post?.postId}
            referenceType={'post'}
            onClickReply={(comment) => setReplyComment(comment)}
          />
        </div>
      </div>
      <div className={styles.postDetailPage__topBar}>
        <BackButton
          pageId={pageId}
          defaultClassName={styles.postDetailPage__backIcon}
          onClick={() => onBack()}
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
      <div className={styles.postDetailPage__commentComposeBar}>
        <CommentComposeBar
          targetId={post?.postId}
          targetType={'post'}
          userToReply={replyComment?.creator?.displayName || undefined}
          isReplying={!!replyComment}
          onSubmit={async (text, mentionees, metadata) => {
            await mutateAsync({ text, mentionees, metadata });
            setReplyComment(null);
          }}
          onCancelReply={() => setReplyComment(null)}
        />
      </div>
    </div>
  );
}
