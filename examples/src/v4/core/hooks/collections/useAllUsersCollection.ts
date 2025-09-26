import { UserRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

type UseAllUsersCollectionParams = {
  queryParams?: Parameters<typeof UserRepository.getUsers>[0];
  shouldCall?: boolean;
};

export default function useAllUsersCollection({
  queryParams,
  shouldCall,
}: UseAllUsersCollectionParams) {
  const { items, ...rest } = useLiveCollection({
    fetcher: UserRepository.getUsers,
    params: queryParams as Parameters<typeof UserRepository.getUsers>[0],
    shouldCall: !!queryParams && shouldCall,
  });

  return {
    users: items,
    ...rest,
  };
}
