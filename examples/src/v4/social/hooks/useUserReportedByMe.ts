import { UserRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';

const useUserReportedByMe = (userId?: string) => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['asc-uikit', 'UserRepository', 'isUserReportedByMe', userId],
    queryFn: () => {
      return UserRepository.isUserFlaggedByMe(userId as string);
    },
    enabled: userId != null,
  });

  return {
    isLoading,
    isFetching,
    isReportedByMe: data,
  };
};

export default useUserReportedByMe;
