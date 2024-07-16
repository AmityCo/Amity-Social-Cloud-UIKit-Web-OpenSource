import React from 'react';
import { Typography } from '~/v4/core/components';
import ReplyCommentIcon from '~/v4/icons/ReplyComment';
import useCommentsCollection from '~/v4/social/hooks/collections/useCommentsCollection';
import ReplyComment from '~/v4/social/components/ReplyComment/ReplyComment';
import styles from './ReplyCommentList.module.css';

interface ReplyCommentProps {
  targetType: Amity.PostTargetType;
  targetId: string;
  referenceId: string;
  parentId: string;
}

export const ReplyCommentList = ({
  referenceId,
  targetId,
  targetType,
  parentId,
}: ReplyCommentProps) => {
  const { comments, hasMore, loadMore } = useCommentsCollection({
    referenceId: referenceId,
    referenceType: targetType,
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
          <ReplyComment
            targetId={targetId}
            targetType={targetType}
            comment={comment as Amity.Comment}
          />
        );
      })}
      {hasMore && (
        <div
          className={styles.postReplyCommentList__viewReply_button}
          onClick={handleClickLoadMore}
        >
          <ReplyCommentIcon className={styles.postReplyCommentList__viewReply_icon} />
          <Typography.CaptionBold className={styles.postReplyCommentList__viewReply_text}>
            View more replies
          </Typography.CaptionBold>
        </div>
      )}
    </div>
  );
};
