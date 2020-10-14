import { CommentRepository, UserRepository } from 'eko-sdk';
import useLiveObject from '~/core/hooks/useLiveObject';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const userRepo = new UserRepository();

const useComment = ({ commentId }) => {
  const comment = useLiveObject(() => CommentRepository.commentForId(commentId), [commentId]);
  const isCommentReady = !!comment.commentId;
  const { userId, referenceId, referenceType } = comment;

  const commentAuthor = useLiveObject(() => userRepo.userForId(userId), [userId]);

  const [commentReplies, commentRepliesHasMore, commentRepliesLoadMore] = useLiveCollection(
    () =>
      CommentRepository.queryComments({
        parentId: commentId,
        filterByParentId: true,
        referenceId,
      }),
    [commentId, referenceId],
  );

  const handleReportComment = () => {
    CommentRepository.flag(commentId);
  };

  const handleReplyToComment = replyCommentText => {
    CommentRepository.createTextComment({
      referenceType,
      referenceId,
      text: replyCommentText,
      parentId: commentId,
    });
  };

  return {
    isCommentReady,
    comment,
    commentAuthor,
    commentReplies,
    commentRepliesHasMore,
    commentRepliesLoadMore,
    handleReportComment,
    handleReplyToComment,
  };
};

export default useComment;
