import { UserRepository } from '@amityco/ts-sdk';
import { useMutation, UseMutateAsyncFunction } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { resolveString } from '~/v4/core/localization';

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
        content: resolveString('amity_social_button_user_reported'),
      });
    },
    onError: () => {
      notification.error({
        content: resolveString('amity_social_toast_user_report_failed'),
      });
    },
  });

  const { mutateAsync: unReportUser } = useMutation({
    mutationFn: (params: Parameters<typeof UserRepository.unflagUser>[0]) => {
      return UserRepository.unflagUser(params);
    },
    onSuccess: () => {
      notification.success({
        content: resolveString('amity_social_button_user_unreported'),
      });
    },
    onError: () => {
      notification.error({
        content: resolveString('amity_social_toast_user_unreport_failed'),
      });
    },
  });

  return {
    reportUser,
    unReportUser,
  };
};

export default useUserReport;
