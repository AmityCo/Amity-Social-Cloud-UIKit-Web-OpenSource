import { UserRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export default function useAllUsersCollection() {
  const { items, ...rest } = useLiveCollection({
    fetcher: UserRepository.getUsers,
    params: {},
  });

  return {
    users: items,
    ...rest,
  };
}
