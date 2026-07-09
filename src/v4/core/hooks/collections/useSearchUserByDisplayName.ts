import { UserRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type Params = Parameters<typeof UserRepository.searchUserByDisplayName>[0];

export function useSearchUserByDisplayName(params: Params) {
  const { items, ...rest } = useLiveCollectionV4<Amity.User, Params>({
    fetcher: UserRepository.searchUserByDisplayName,
    params,
  });

  return {
    users: items,
    ...rest,
  };
}
