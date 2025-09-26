import { UserRepository } from '@amityco/ts-sdk';
import { useMutation, UseMutateAsyncFunction } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

type ReportUserParams = Parameters<typeof UserRepository.flagUser>[0];
type UnreportUserParams = Parameters<typeof UserRepository.unflagUser>[0];

type UseUserReportReturnType = {
  reportUser: UseMutateAsyncFunction<boolean, unknown, ReportUserParams>;
  unReportUser: UseMutateAsyncFunction<boolean, unknown, UnreportUserParams>;
};

const useUserReport = (): UseUserReportReturnType => {
  const notification = useNotifications();

  const { mutateAsync: reportUser } = useMutation({
    mutationFn: (params: Parameters<typeof UserRepository.flagUser>[0]) => {
      return UserRepository.flagUser(params);
    },
    onSuccess: () => {
      notification.success({
        content: 'User reported.',
      });
    },
    onError: () => {
      notification.error({
        content: 'Failed to report user. Please try again.',
      });
    },
  });

  const { mutateAsync: unReportUser } = useMutation({
    mutationFn: (params: Parameters<typeof UserRepository.unflagUser>[0]) => {
      return UserRepository.unflagUser(params);
    },
    onSuccess: () => {
      notification.success({
        content: 'User unreported.',
      });
    },
    onError: () => {
      notification.error({
        content: 'Failed to unreported user. Please try again.',
      });
    },
  });

  return {
    reportUser,
    unReportUser,
  };
};

export default useUserReport;
