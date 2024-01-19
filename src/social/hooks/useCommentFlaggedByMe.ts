import { CommentRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

const useCommentFlaggedByMe = (commentId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(false);

  useEffect(() => {
    if (!commentId) return;
    CommentRepository.isCommentFlaggedByMe(commentId).then((value) => {
      setIsFlaggedByMe(value);
      setIsLoading(false);
    });
  }, [commentId]);

  const flagComment = async () => {
    if (commentId == null) return;
    try {
      setIsFlaggedByMe(true);
      await CommentRepository.flagComment(commentId);
    } catch (_error) {
      setIsFlaggedByMe(false);
    }
  };

  const unflagComment = async () => {
    if (commentId == null) return;
    try {
      setIsFlaggedByMe(false);
      await CommentRepository.unflagComment(commentId);
    } catch (_error) {
      setIsFlaggedByMe(true);
    }
  };

  const toggleFlagComment = async () => {
    if (commentId == null) return;
    if (isFlaggedByMe) {
      unflagComment();
    } else {
      flagComment();
    }
  };

  return {
    isLoading,
    isFlaggedByMe,
    flagComment,
    unflagComment,
    toggleFlagComment,
  };
};

export default useCommentFlaggedByMe;
