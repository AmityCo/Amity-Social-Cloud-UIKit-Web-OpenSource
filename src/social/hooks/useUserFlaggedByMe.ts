import { UserRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const useUserFlaggedByMe = (userId?: string) => {
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['asc-uikit', 'UserRepository', 'isUserFlaggedByMe', userId],
    queryFn: () => {
      return UserRepository.isUserFlaggedByMe(userId as string);
    },
    enabled: userId != null,
  });

  useEffect(() => {
    if (data != null) {
      setIsFlaggedByMe(data);
    }
  }, [data]);

  const flagUser = async () => {
    if (userId == null) return;
    try {
      await UserRepository.flagUser(userId);
    } catch (_error) {
      setIsFlaggedByMe(false);
    } finally {
      refetch();
    }
  };

  const unflagUser = async () => {
    if (userId == null) return;
    try {
      await UserRepository.unflagUser(userId);
      setIsFlaggedByMe(false);
    } catch (_error) {
      setIsFlaggedByMe(true);
    } finally {
      refetch();
    }
  };

  const toggleFlagUser = async () => {
    if (userId == null) return;
    if (isFlaggedByMe) {
      unflagUser();
    } else {
      flagUser();
    }
  };

  return {
    isLoading,
    isFlaggedByMe,
    flagUser,
    unflagUser,
    toggleFlagUser,
  };
};

export default useUserFlaggedByMe;
