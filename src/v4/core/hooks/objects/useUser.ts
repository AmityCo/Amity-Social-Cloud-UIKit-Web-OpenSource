/* eslint-disable no-nested-ternary */

import { SubscriptionLevels, UserRepository } from '@amityco/ts-sdk';

import useLiveObject from '~/v4/core/hooks/useLiveObject';
import useUserSubscription from '~/social/hooks/useUserSubscription';

const useUser = (userId?: string | null) => {
  useUserSubscription({
    userId,
    level: SubscriptionLevels.USER,
  });

  const { item, ...rest } = useLiveObject({
    fetcher: UserRepository.getUser,
    params: userId,
    shouldCall: () => !!userId,
  });

  return {
    user: item,
    ...rest,
  };
};

export default useUser;
