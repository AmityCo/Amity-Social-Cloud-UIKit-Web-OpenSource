import { useMutation } from '@tanstack/react-query';
import { PollRepository } from '@amityco/ts-sdk';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

export function useVotePoll({
  onPostDeleted,
  parentPost,
}: {
  onPostDeleted?: (post: Amity.Post) => void;
  parentPost: Amity.Post;
}) {
  const { info } = useNotifications();
  return useMutation({
    mutationFn: async ({ pollId, answerIds }: { pollId: string; answerIds: string[] }) => {
      return PollRepository.votePoll(pollId, answerIds);
    },
    onError: (err: Error) => {
      if (err.message.includes(ERROR_RESPONSE.POLL_CLOSED)) info({ content: 'Poll ended.' });
      else if (err.message.includes(ERROR_RESPONSE.POLL_NOT_FOUND)) {
        info({ content: 'This post is no longer available.' });
        onPostDeleted?.(parentPost);
      } else {
        info({ content: 'Oops, something went wrong.' });
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
      success({ content: 'Vote removed.' });
    },
    onError: (err: Error) => {
      if (err.message.includes(ERROR_RESPONSE.POLL_CLOSED)) {
        info({ content: 'Poll ended.' });
        onPollEnded?.(true);
      } else if (err.message.includes(ERROR_RESPONSE.POLL_NOT_FOUND)) {
        info({ content: 'This post is no longer available.' });
        onPostDeleted?.(parentPost);
      } else {
        info({ content: 'Oops, something went wrong.' });
      }
    },
  });
}
