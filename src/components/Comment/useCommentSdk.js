import { CommentRepository, UserRepository } from 'eko-sdk';
import useLiveObject from 'hooks/useLiveObject';
import useLiveCollection from 'hooks/useLiveCollection';

const commentRepo = new CommentRepository();
const userRepo = new UserRepository();

const useCommentSdk = ({ commentId, isReplyComment = false }) => {
  const comment = useLiveObject(() => commentRepo.commentForId(commentId), {});
  const isCommentReady = !!comment.commentId;
  const { userId, referenceId, referenceType } = comment;

  const commentAuthor = useLiveObject(
    () => userRepo.userForId(userId),
    {},
    () => !userId,
    [userId],
  );

  // TODO - get pagination params here and used to show/hide replies.
  const [commentReplies] = useLiveCollection(
    () =>
      commentRepo.queryComments({
        parentId: commentId,
        filterByParentId: true,
        referenceId,
      }),
    [],
    () => isReplyComment || !referenceId,
    [isReplyComment, referenceId],
  );

  const handleReportComment = () => {
    commentRepo.flag(commentId);
  };

  const handleReplyToComment = replyCommentText => {
    commentRepo.createTextComment({
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
    handleReportComment,
    handleReplyToComment,
  };
};

export default useCommentSdk;
