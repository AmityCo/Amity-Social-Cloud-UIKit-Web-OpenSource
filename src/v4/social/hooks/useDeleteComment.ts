import { CommentRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNetworkState } from 'react-use';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { EVENT_LISTENER } from '~/v4/social/constants/eventListener';

interface UseDeleteCommentParams {
  commentId: string | undefined;
  /** parentId of the comment being deleted — undefined for L0, set for L1/L2.
   *  Included in the dispatched 'comment-deleted' event so consumers can
   *  scope their reaction to comments belonging to a specific parent. */
  parentId?: string;
  onSuccess?: () => void;
}

export const useDeleteComment = ({ commentId, parentId, onSuccess }: UseDeleteCommentParams) => {
  const { online } = useNetworkState();
  const { info } = useNotifications();

  const { page } = useNavigation();

  const { mutate: handleDeleteComment, isPending } = useMutation({
    mutationFn: async () => {
      if (!commentId) return;
      await CommentRepository.deleteComment(commentId);
    },
    onError: (error: Error) => {
      if (error.message.includes(ERROR_RESPONSE.DELETED_COMMENT))
        info({
          content: 'This reply is no longer available.',
        });
      else {
        info({
          content: 'Oops, something went wrong',
        });
      }
    },
    onSuccess: () => {
      if (commentId) {
        document.dispatchEvent(
          new CustomEvent(EVENT_LISTENER.COMMENT_DELETED, { detail: { commentId, parentId } }),
        );
      }
      onSuccess?.();
    },
  });

  return { handleDeleteComment, isPending };
};
