import { UserRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type FollowStatusInput = Amity.QueryFollowers['status'];

export default function useFollowersCollection({
  userId,
  status,
}: {
  userId?: string | null;
  status: FollowStatusInput;
}) {
  const { items, ...rest } = useLiveCollectionV4({
    fetcher: UserRepository.Relationship.getFollowers,
    params: {
      limit: 20,
      userId: userId as string,
      status: status ?? undefined,
    },
    shouldCall: !!userId,
  });

  return {
    followers: items,
    ...rest,
  };
}
