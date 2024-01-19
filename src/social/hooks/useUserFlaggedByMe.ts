import { UserRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

const useUserFlaggedByMe = (userId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(false);

  const fetchUserFlaggedByMe = async () => {
    if (!userId) return;
    UserRepository.isUserFlaggedByMe(userId).then((value) => {
      setIsFlaggedByMe(value);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (!userId) return;
    fetchUserFlaggedByMe();
  }, [userId]);

  const flagUser = async () => {
    if (userId == null) return;
    try {
      await UserRepository.flagUser(userId);
      setIsFlaggedByMe(true);
    } catch (_error) {
      setIsFlaggedByMe(false);
    } finally {
      fetchUserFlaggedByMe();
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
      fetchUserFlaggedByMe();
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
