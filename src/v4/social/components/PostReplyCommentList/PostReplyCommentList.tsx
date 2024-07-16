import React from 'react';
import { Typography } from '~/v4/core/components';
import ReplyComment from '~/v4/icons/ReplyComment';
import useCommentsCollection from '~/v4/social/hooks/collections/useCommentsCollection';
import PostReplyComment from '~/v4/social/components/PostReplyComment/PostReplyComment';
import styles from './PostReplyCommentList.module.css';

interface PostReplyCommentProps {
  postTargetType: Amity.PostTargetType;
  postTargetId: string;
  referenceId: string;
  parentId: string;
}

export const PostReplyCommentList = ({
  referenceId,
  postTargetId,
  postTargetType,
  parentId,
}: PostReplyCommentProps) => {
  const { comments, hasMore, loadMore } = useCommentsCollection({
    referenceId: referenceId,
    referenceType: 'post',
    parentId: parentId,
    limit: 5,
    shouldCall: true,
    includeDeleted: true,
  });

  const handleClickLoadMore = () => {
    loadMore();
  };

  return (
    <div>
      {comments.map((comment) => {
        return (
          <PostReplyComment
            postTargetId={postTargetId}
            postTargetType={postTargetType}
            comment={comment as Amity.Comment}
          />
        );
      })}
      {hasMore && (
        <div
          className={styles.postReplyCommentList__viewReply_button}
          onClick={handleClickLoadMore}
        >
          <ReplyComment className={styles.postReplyCommentList__viewReply_icon} />
          <Typography.CaptionBold className={styles.postReplyCommentList__viewReply_text}>
            View more replies
          </Typography.CaptionBold>
        </div>
      )}
    </div>
  );
};
