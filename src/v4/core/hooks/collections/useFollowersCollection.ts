import { UserRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

type FollowStatusInput = Amity.QueryFollowers['status'];

export default function useFollowersCollection({
  userId,
  status,
}: {
  userId?: string | null;
  status: FollowStatusInput;
}) {
  const { items, ...rest } = useLiveCollection({
    fetcher: UserRepository.Relationship.getFollowers,
    params: {
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
