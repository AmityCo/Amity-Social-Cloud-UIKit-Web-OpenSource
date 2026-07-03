import { UserRepository } from '@amityco/ts-sdk';
import useLiveObjectV4 from '~/v4/core/hooks/useLiveObjectV4';

type UseFollowInfoParams = {
  userId?: Parameters<typeof UserRepository.Relationship.getFollowInfo>[0];
};

export function useFollowInfo({ userId }: UseFollowInfoParams) {
  const { item, isLoading, error } = useLiveObjectV4<string, Amity.FollowInfo, never>({
    fetcher: UserRepository.Relationship.getFollowInfo,
    params: userId ?? '',
    shouldCall: !!userId,
  });

  const status = item?.status;
  const isBlockedByMe = status === 'blocked';

  return {
    followInfo: item,
    status,
    isBlockedByMe,
    isLoading,
    error,
  };
}
