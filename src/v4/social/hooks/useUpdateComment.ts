import { useCallback } from 'react';
import { resolveString } from '~/v4/core/localization';
import { CommentRepository } from '@amityco/ts-sdk';
import { useNetworkState } from 'react-use';
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

  const handleSaveComment = useCallback(async () => {
    if (!online) {
      notification.info({
        content: resolveString('amity_social_toast_failed_generic'),
        alignment: 'withSidebar',
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
          content: resolveString('amity_social_button_add_blocked_words_comment_error_message'),
        });
      } else if (error instanceof Error && error.message.includes(ERROR_RESPONSE.BLOCKED_URL)) {
        notification.info({
          content: resolveString('amity_add_blocked_url_comment_error_message'),
        });
      } else {
        notification.info({
          content: resolveString('amity_social_toast_failed_generic'),
        });
      }
      return;
    }

    // Only reached when the API call succeeded — onSuccess errors won't be mistaken
    // for API errors and won't trigger misleading notifications.
    setIsEditing(false);
    onSuccess?.(commentData);
  }, [commentData, commentId, online, notification, setIsEditing, onSuccess]);

  return { handleSaveComment };
};
