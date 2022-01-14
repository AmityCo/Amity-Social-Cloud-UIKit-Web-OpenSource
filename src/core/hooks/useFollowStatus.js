import { UserRepository, FollowRequestStatus } from '@amityco/js-sdk';
import useLiveObject from '~/core/hooks/useLiveObject';

const useFollowStatus = (sourceUserId, targetUserId) => {
  const followInfo = useLiveObject(
    () => UserRepository.getFollowInfo(sourceUserId, targetUserId),
    [sourceUserId, targetUserId],
  );

  return followInfo?.status ?? FollowRequestStatus.None;
};

export default useFollowStatus;
