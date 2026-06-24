import { UserRepository } from '@amityco/ts-sdk';
import { useEffect } from 'react';
import useLiveObjectV4 from '~/v4/core/hooks/useLiveObjectV4';
import { useUserCache } from '~/v4/core/providers/UserCacheProvider';

export const useUser = ({
  userId,
  shouldCall = true,
}: {
  userId?: string | null;
  shouldCall?: boolean;
}) => {
  const { users, setUser } = useUserCache();
  const { item, refresh, ...rest } = useLiveObjectV4({
    fetcher: UserRepository.getUser,
    params: userId!,
    shouldCall: !!userId && shouldCall,
  });

  // When fresh data arrives, update the shared cache (only if data matches requested userId)
  useEffect(() => {
    if (shouldCall && item && userId && item.userId === userId) {
      setUser(userId, item);
    }
  }, [item, userId, setUser, shouldCall]);

  // Validate data matches requested userId before returning
  const validItem = item?.userId === userId ? item : null;
  const cachedUser = userId && users[userId]?.userId === userId ? users[userId] : null;
  const user = !userId || !shouldCall ? null : validItem || cachedUser;

  return {
    user,
    refresh,
    ...rest,
  };
};

export default useUser;
