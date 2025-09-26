import { UserRepository } from '@amityco/ts-sdk';

import useLiveObject from '~/v4/core/hooks/useLiveObject';

export const useUser = ({
  userId,
  shouldCall = true,
}: {
  userId?: string | null;
  shouldCall?: boolean;
}) => {
  const { item, refresh, ...rest } = useLiveObject({
    fetcher: UserRepository.getUser,
    params: userId,
    shouldCall: !!userId && shouldCall,
  });

  return {
    user: item,
    refresh,
    ...rest,
  };
};
