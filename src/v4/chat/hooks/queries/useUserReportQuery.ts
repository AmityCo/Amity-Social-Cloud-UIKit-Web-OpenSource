import { UserRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { resolveString } from '~/v4/core/localization';

type UseUserReportQueryParams = {
  user?: Amity.User | null;
  enabled?: boolean;
};

type UserReportPayload = {
  userId: Parameters<typeof UserRepository.flagUser>[0];
};

type FlagResponse = Awaited<ReturnType<typeof UserRepository.flagUser>>;

type UnflagResponse = Awaited<ReturnType<typeof UserRepository.unflagUser>>;

/**
 * Report / unreport for chat screens. The yes/no state is the user object's own
 * `isFlaggedByMe` hint (local Bloom test, no request); `queryIsFlaggedByMe(user)` gives the
 * exact answer from `user.getUserFlagsByMe()`, which skips the request when the hint is
 * `false`. No react-query cache: the hint follows the user object a live object or
 * collection delivers, so there is nothing to invalidate.
 */
export function useUserReportQuery({ user, enabled = true }: UseUserReportQueryParams = {}) {
  const { success, error } = useNotifications('chat');

  const isFlaggedByMe = enabled && !!user && user.isFlaggedByMe;

  const queryIsFlaggedByMe = async (target: Amity.User) => {
    const { isFlagByMe } = await target.getUserFlagsByMe();
    return isFlagByMe;
  };

  const reportMutation = useMutation<FlagResponse, Error, UserReportPayload>({
    mutationFn: ({ userId: id }) => UserRepository.flagUser(id),
    onSuccess: () => {
      success({
        content: resolveString('amity_chat_action_report_user_success'),
        alignment: 'fullscreen',
      });
    },
    onError: () => {
      error({
        content: resolveString('amity_chat_action_report_user_failed'),
        alignment: 'fullscreen',
      });
    },
  });

  const unreportMutation = useMutation<UnflagResponse, Error, UserReportPayload>({
    mutationFn: ({ userId: id }) => UserRepository.unflagUser(id),
    onSuccess: () => {
      success({
        content: resolveString('amity_chat_action_unreport_user_success'),
        alignment: 'fullscreen',
      });
    },
    onError: () => {
      error({
        content: resolveString('amity_chat_action_unreport_user_failed'),
        alignment: 'fullscreen',
      });
    },
  });

  async function report(targetUserId: UserReportPayload['userId']): Promise<void> {
    await reportMutation.mutateAsync({ userId: targetUserId });
  }

  async function unreport(targetUserId: UserReportPayload['userId']): Promise<void> {
    await unreportMutation.mutateAsync({ userId: targetUserId });
  }

  return {
    isFlaggedByMe,
    isLoading: false,
    queryIsFlaggedByMe,
    report,
    unreport,
  };
}
