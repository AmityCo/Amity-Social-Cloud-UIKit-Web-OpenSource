import React, { useCallback, useState } from 'react';
import { CommentComposer } from '~/v4/social/components/CommentComposer/CommentComposer';
import { CommentList } from '~/v4/social/components/CommentList/CommentList';
import styles from './ClipFeedMenu.module.css';

type CommentDrawerProps = {
  pageId?: string;
  post: Amity.Post;
  community?: Amity.Community | null;
};

export const CommentDrawer = ({ pageId = '*', post, community }: CommentDrawerProps) => {
  const [replyComment, setReplyComment] = useState<Amity.Comment | undefined>();

  const handleReplyClick = useCallback(
    (comment: Amity.Comment) =>
      setReplyComment((prevComment) =>
        prevComment?.commentId === comment?.commentId ? undefined : comment,
      ),
    [],
  );

  const isNonMemberCommunity = post?.targetType === 'community' && !community?.isJoined;

  return (
    <div className={styles.clipFeedMenu__commentContainer}>
      {post?.commentsCount > 0 && (
        <div>
          {post && (
            <CommentList
              pageId={pageId}
              referenceId={post.postId}
              referenceType="post"
              onClickReply={handleReplyClick}
              community={community}
              commentCount={post.commentsCount}
              commentListClassName={styles.clipFeedMenu__commentListContainer}
            />
          )}
        </div>
      )}

      {!isNonMemberCommunity && post && (
        <CommentComposer
          pageId={pageId}
          referenceId={post.postId}
          referenceType={'post'}
          replyTo={replyComment}
          onCancelReply={() => setReplyComment(undefined)}
          community={community}
          commentComposerClassName={styles.clipFeedMenu__commentComposer}
        />
      )}
    </div>
  );
};
