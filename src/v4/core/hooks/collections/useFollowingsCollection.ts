import { UserRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

type FollowStatusInput = Amity.QueryFollowings['status'];

export default function useFollowingsCollection({
  userId,
  status,
}: {
  userId?: string | null;
  status: FollowStatusInput;
}) {
  const { items, ...rest } = useLiveCollection({
    fetcher: UserRepository.Relationship.getFollowings,
    params: {
      userId: userId as string,
      status: status ?? undefined,
    },
    shouldCall: !!userId,
  });

  return {
    followings: items,
    ...rest,
  };
}
