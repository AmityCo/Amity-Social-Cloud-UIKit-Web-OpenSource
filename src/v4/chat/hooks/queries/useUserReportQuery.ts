import { UserRepository } from '@amityco/ts-sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

const flaggedByMeQueryKey = (userId?: UserReportPayload['userId']) => [
  'asc-uikit',
  'UserRepository',
  'isUserFlaggedByMe',
  userId,
];

export function useUserReportQuery({ userId, enabled = true }: UseUserReportQueryParams = {}) {
  const queryClient = useQueryClient();
  const { success, error } = useNotifications();

  const { data: isFlaggedByMe, isLoading } = useQuery<boolean>({
    queryKey: flaggedByMeQueryKey(userId),
    queryFn: () => UserRepository.isUserFlaggedByMe(userId!),
    enabled: enabled && !!userId,
  });

  const queryIsFlaggedByMe = (userId: UserReportPayload['userId']) =>
    queryClient.fetchQuery({
      queryKey: flaggedByMeQueryKey(userId),
      queryFn: () => UserRepository.isUserFlaggedByMe(userId),
    });

  const reportMutation = useMutation<FlagResponse, Error, UserReportPayload>({
    mutationFn: ({ userId: id }) => UserRepository.flagUser(id),
    onSuccess: (_response, { userId: id }) => {
      queryClient.invalidateQueries({ queryKey: flaggedByMeQueryKey(id) });
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
    onSuccess: (_response, { userId: id }) => {
      queryClient.invalidateQueries({ queryKey: flaggedByMeQueryKey(id) });
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
    isFlaggedByMe: !!isFlaggedByMe,
    isLoading,
    queryIsFlaggedByMe,
    report,
    unreport,
  };
}
