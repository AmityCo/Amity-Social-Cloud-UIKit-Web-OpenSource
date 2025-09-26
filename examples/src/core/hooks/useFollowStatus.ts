import { UserRepository } from '@amityco/ts-sdk';
import useLiveObject from './useLiveObject';

// TODO: Breaking changes
const useFollowStatus = (sourceUserId?: string | null) => {
  const followInfo = useLiveObject({
    fetcher: UserRepository.Relationship.getFollowInfo,
    params: sourceUserId,
  });

  return followInfo?.status ?? 'none';
};

export default useFollowStatus;
