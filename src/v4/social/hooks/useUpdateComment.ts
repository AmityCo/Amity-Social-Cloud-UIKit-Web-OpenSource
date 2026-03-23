import { useCallback } from 'react';
import { CommentRepository } from '@amityco/ts-sdk';
import { useNetworkState } from 'react-use';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { CreateCommentParams } from '~/v4/social/components/CommentComposer/CommentComposer';

interface UseUpdateCommentParams {
  commentId: string | undefined;
  commentData: CreateCommentParams | undefined;
  setIsEditing: (value: boolean) => void;
  onSuccess?: (data: CreateCommentParams) => void;
}

export const useUpdateComment = ({
  commentId,
  commentData,
  setIsEditing,
  onSuccess,
}: UseUpdateCommentParams) => {
  const { online } = useNetworkState();
  const notification = useNotifications();
  const { page } = useNavigation();

  const handleSaveComment = useCallback(async () => {
    if (!online) {
      notification.info({
        content: 'Oops, something went wrong',
        alignment: `${page.type === PageTypes.ViewStoryPage ? 'fullscreen' : 'withSidebar'}`,
      });
      return;
    }
    if (!commentData || !commentId) return;

    try {
      await CommentRepository.updateComment(commentId, {
        data: commentData.data,
        mentionees: commentData.mentionees as Amity.UserMention[],
        metadata: commentData.metadata,
        links: commentData.links || [],
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes(ERROR_RESPONSE.BLOCKED_WORD)) {
        notification.info({
          content: 'Your comment contains inappropriate word. Please review and delete it.',
        });
      } else if (error instanceof Error && error.message.includes(ERROR_RESPONSE.BLOCKED_URL)) {
        notification.info({
          content: "Your comment contains a link that's not allowed. Please review and delete it.",
        });
      } else {
        notification.info({
          content: 'Oops, something went wrong',
        });
      }
      return;
    }

    // Only reached when the API call succeeded — onSuccess errors won't be mistaken
    // for API errors and won't trigger misleading notifications.
    setIsEditing(false);
    onSuccess?.(commentData);
  }, [commentData, commentId, online, notification, page.type, setIsEditing, onSuccess]);

  return { handleSaveComment };
};
