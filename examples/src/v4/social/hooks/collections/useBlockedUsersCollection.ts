import { UserRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

const QUERY_LIMIT = 10;

export default function useBlockedUsersCollection({
  limit = QUERY_LIMIT,
}: Partial<Parameters<typeof UserRepository.getBlockedUsers>[0]>) {
  const { items, ...rest } = useLiveCollection({
    fetcher: UserRepository.getBlockedUsers,
    params: {
      limit,
    },
  });

  return {
    users: items,
    ...rest,
  };
}
