import { UserRepository } from '@amityco/ts-sdk';

import useLiveObject from '~/v4/core/hooks/useLiveObject';

export const useUser = (userId?: string | null) => {
  const { item, ...rest } = useLiveObject({
    fetcher: UserRepository.getUser,
    params: userId,
    shouldCall: !!userId,
  });

  return {
    user: item,
    ...rest,
  };
};
