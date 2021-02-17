import { CommentRepository } from 'eko-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';
import useMemoAsync from '~/core/hooks/useMemoAsync';

import useUser from '~/core/hooks/useUser';

const useComment = ({ commentId }) => {
  const comment = useLiveObject(() => CommentRepository.commentForId(commentId), [commentId]);
  const isCommentReady = !!comment.commentId;
  const { userId, referenceId, referenceType } = comment;

  const { user: commentAuthor, file: commentAuthorAvatar } = useUser(userId, [userId]);

  const isFlaggedByMe = useMemoAsync(
    async () => !!(comment?.commentId && CommentRepository.isFlaggedByMe(comment?.commentId)),
    [comment],
  );

  const handleReportComment = async () => {
    return isFlaggedByMe ? CommentRepository.unflag(commentId) : CommentRepository.flag(commentId);
  };

  const handleReplyToComment = replyCommentText => {
    CommentRepository.createTextComment({
      referenceType,
      referenceId,
      text: replyCommentText,
      parentId: commentId,
    });
  };

  const handleEditComment = text => {
    CommentRepository.editTextComment({
      commentId,
      text,
    });
  };

  const handleDeleteComment = () => {
    CommentRepository.deleteComment(commentId);
  };

  return {
    isCommentReady,
    comment,
    commentAuthor,
    commentAuthorAvatar,
    handleReportComment,
    handleReplyToComment,
    handleEditComment,
    handleDeleteComment,
    isFlaggedByMe,
  };
};

export default useComment;
