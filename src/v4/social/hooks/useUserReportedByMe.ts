import { UserRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';
import useSDK from '~/v4/core/hooks/useSDK';

const useUserReportedByMe = (userId?: string) => {
  const { isVisitorOrBot } = useSDK();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['asc-uikit', 'UserRepository', 'isUserReportedByMe', userId],
    queryFn: () => {
      return UserRepository.isUserFlaggedByMe(userId as string);
    },
    enabled: userId != null && !isVisitorOrBot,
  });

  return {
    isLoading,
    isFetching,
    isReportedByMe: data,
  };
};

export default useUserReportedByMe;
