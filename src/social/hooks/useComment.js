import { CommentRepository } from '@amityco/js-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';
import useMemoAsync from '~/core/hooks/useMemoAsync';

import useUser from '~/core/hooks/useUser';

const useComment = ({ commentId }) => {
  const comment = useLiveObject(() => CommentRepository.commentForId(commentId), [commentId]);
  const isCommentReady = !!comment.commentId;
  const { userId, referenceId, referenceType } = comment;

  const { user: commentAuthor, file: commentAuthorAvatar } = useUser(userId);

  const isFlaggedByMe = useMemoAsync(
    async () => (comment?.commentId ? CommentRepository.isFlaggedByMe(comment.commentId) : false),
    [comment],
  );

  const handleReportComment = async () => {
    return isFlaggedByMe ? CommentRepository.unflag(commentId) : CommentRepository.flag(commentId);
  };

  const handleReplyToComment = (replyCommentText, mentionees, metadata) => {
    CommentRepository.createTextComment({
      referenceType,
      referenceId,
      text: replyCommentText,
      parentId: commentId,
      metadata,
      mentionees,
    });
  };

  const handleEditComment = (text, mentionees, metadata) => {
    CommentRepository.editTextComment({
      commentId,
      text,
      metadata,
      mentionees,
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
