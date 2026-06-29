import React, { useCallback, useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { CommentComposer } from '~/v4/social/components/CommentComposer/CommentComposer';
import { CommentList } from '~/v4/social/components/CommentList/CommentList';
import { DrawerProvider } from '~/v4/core/providers/DrawerProvider';
import { DrawerContainer } from '~/v4/core/components/Drawer';
import styles from './ClipFeedMenu.module.css';

type CommentDrawerProps = {
  pageId?: string;
  post: Amity.Post;
  community?: Amity.Community | null;
};

export const CommentDrawer = ({ pageId = '*', post, community }: CommentDrawerProps) => {
  const { isVisitorOrBot } = useSDK();
  const [replyComment, setReplyComment] = useState<Amity.Comment | undefined>();
  const [replyParentIdOverride, setReplyParentIdOverride] = useState<string | undefined>(undefined);

  const handleReplyClick = useCallback(
    ({ comment, parentIdOverride }: { comment: Amity.Comment; parentIdOverride?: string }) =>
      setReplyComment((prevComment) => {
        setReplyParentIdOverride(
          prevComment?.commentId === comment?.commentId ? undefined : parentIdOverride,
        );
        return prevComment?.commentId === comment?.commentId ? undefined : comment;
      }),
    [],
  );

  const isNonMemberCommunity = post?.targetType === 'community' && !community?.isJoined;

  return (
    <DrawerProvider>
      <div
        className={styles.clipFeedMenu__commentContainer}
        data-no-comment={post?.commentsCount === 0}
      >
        {post && (
          <CommentList
            pageId={pageId}
            referenceId={post.postId}
            referenceType="post"
            onClickReply={handleReplyClick}
            community={community}
            commentCount={post.commentsCount}
            commentListClassName={styles.clipFeedMenu__commentListContainer}
            refreshOnNewComment
          />
        )}

        {!isVisitorOrBot && !isNonMemberCommunity && post && (
          <CommentComposer
            pageId={pageId}
            referenceId={post.postId}
            referenceType={'post'}
            replyTo={replyComment}
            parentIdOverride={replyParentIdOverride}
            onCancelReply={() => {
              setReplyComment(undefined);
              setReplyParentIdOverride(undefined);
            }}
            community={community}
            commentComposerClassName={styles.clipFeedMenu__commentComposer}
          />
        )}
      </div>
      <DrawerContainer />
    </DrawerProvider>
  );
};
