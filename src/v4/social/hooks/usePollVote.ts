import { useMutation } from '@tanstack/react-query';
import { resolveString } from '~/v4/core/localization';
import { PollRepository } from '@amityco/ts-sdk';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

export function useVotePoll({
  onPollEnded,
  onPostDeleted,
  parentPost,
}: {
  onPollEnded?: (val: boolean) => void;
  onPostDeleted?: (post: Amity.Post) => void;
  parentPost: Amity.Post;
}) {
  const { info } = useNotifications();
  return useMutation({
    mutationFn: async ({ pollId, answerIds }: { pollId: string; answerIds: string[] }) => {
      return PollRepository.votePoll(pollId, answerIds);
    },
    onError: (err: Error) => {
      if (err.message.includes(ERROR_RESPONSE.POLL_CLOSED)) {
        info({ content: resolveString('amity_social_button_poll_ended') });
        onPollEnded?.(true);
      } else if (err.message.includes(ERROR_RESPONSE.POLL_NOT_FOUND)) {
        info({ content: resolveString('amity_social_toast_poll_post_unavailable_toast') });
        onPostDeleted?.(parentPost);
      } else {
        info({ content: resolveString('amity_social_toast_failed_generic') });
      }
    },
  });
}

export function useUnvotePoll({
  onPollEnded,
  onPostDeleted,
  parentPost,
}: {
  onPollEnded?: (val: boolean) => void;
  onPostDeleted?: (post: Amity.Post) => void;
  parentPost: Amity.Post;
}) {
  const { info, success } = useNotifications();
  return useMutation({
    mutationFn: async ({ pollId }: { pollId: string }) => {
      return PollRepository.unvotePoll(pollId);
    },
    onSuccess: () => {
      success({ content: resolveString('amity_social_button_vote_removed') });
    },
    onError: (err: Error) => {
      if (err.message.includes(ERROR_RESPONSE.POLL_CLOSED)) {
        info({ content: resolveString('amity_social_button_poll_ended') });
        onPollEnded?.(true);
      } else if (err.message.includes(ERROR_RESPONSE.POLL_NOT_FOUND)) {
        info({ content: resolveString('amity_social_toast_poll_post_unavailable_toast') });
        onPostDeleted?.(parentPost);
      } else {
        info({ content: resolveString('amity_social_toast_failed_generic') });
      }
    },
  });
}
