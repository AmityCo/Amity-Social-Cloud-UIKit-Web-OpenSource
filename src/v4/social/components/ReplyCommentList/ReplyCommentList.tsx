import React from 'react';
import { Typography } from '~/v4/core/components';
import { CommentSkeleton } from '~/v4/social/components/Comment/CommentSkeleton';
import ReplyCommentIcon from '~/v4/icons/ReplyComment';
import useCommentsCollection from '~/v4/social/hooks/collections/useCommentsCollection';
import ReplyComment from '~/v4/social/components/ReplyComment/ReplyComment';
import styles from './ReplyCommentList.module.css';

interface ReplyCommentProps {
  community?: Amity.Community;
  referenceId: string;
  referenceType: string;
  parentId: string;
}

export const ReplyCommentList = ({
  referenceId,
  referenceType,
  community,
  parentId,
}: ReplyCommentProps) => {
  const { comments, hasMore, isLoading, loadMore } = useCommentsCollection({
    referenceId,
    referenceType: referenceType as Amity.CommentReferenceType,
    parentId,
    limit: 10,
    shouldCall: true,
    includeDeleted: true,
  });

  const handleClickLoadMore = () => {
    loadMore();
  };

  return (
    <div>
      {isLoading && <CommentSkeleton numberOfSkeletons={3} />}
      {comments.map((comment) => {
        return <ReplyComment community={community} comment={comment as Amity.Comment} />;
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
