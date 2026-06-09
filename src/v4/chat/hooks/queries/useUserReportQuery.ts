import { UserRepository } from '@amityco/ts-sdk';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { resolveString } from '~/v4/core/localization';

type UseUserReportQueryParams = {
  userId?: Parameters<typeof UserRepository.flagUser>[0];
  enabled?: boolean;
};

type UserReportPayload = {
  userId: Parameters<typeof UserRepository.flagUser>[0];
};

type FlagResponse = Awaited<ReturnType<typeof UserRepository.flagUser>>;

type UnflagResponse = Awaited<ReturnType<typeof UserRepository.unflagUser>>;

export function useUserReportQuery({ userId, enabled = true }: UseUserReportQueryParams = {}) {
  const { success, error } = useNotifications();

  const {
    data: isFlaggedByMe,
    isLoading,
    refetch,
  } = useQuery<boolean>({
    queryKey: ['asc-uikit', 'UserRepository', 'isUserFlaggedByMe', userId],
    queryFn: () => UserRepository.isUserFlaggedByMe(userId!),
    enabled: enabled && !!userId,
  });

  const reportMutation = useMutation<FlagResponse, Error, UserReportPayload>({
    mutationFn: ({ userId: id }) => UserRepository.flagUser(id),
    onSuccess: () => {
      refetch();
      success({ content: resolveString('amity_chat_action_report_user_success') });
    },
    onError: () => {
      error({ content: resolveString('amity_chat_action_report_user_failed') });
    },
  });

  const unreportMutation = useMutation<UnflagResponse, Error, UserReportPayload>({
    mutationFn: ({ userId: id }) => UserRepository.unflagUser(id),
    onSuccess: () => {
      refetch();
      success({ content: resolveString('amity_chat_action_unreport_user_success') });
    },
    onError: () => {
      error({ content: resolveString('amity_chat_action_unreport_user_failed') });
    },
  });

  async function report(targetUserId: UserReportPayload['userId']): Promise<void> {
    await reportMutation.mutateAsync({ userId: targetUserId });
  }

  async function unreport(targetUserId: UserReportPayload['userId']): Promise<void> {
    await unreportMutation.mutateAsync({ userId: targetUserId });
  }

  return {
    isFlaggedByMe: !!isFlaggedByMe,
    isLoading,
    report,
    unreport,
  };
}
