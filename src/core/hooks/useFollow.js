import { UserRepository, FollowRequestStatus } from '@amityco/js-sdk';

import useFollowStatus from '~/core/hooks/useFollowStatus';

const useFollow = (sourceUserId, targetUserId) => {
  const followStatus = useFollowStatus(sourceUserId, targetUserId);

  const follow = () => UserRepository.follow(targetUserId);
  const followAccept = () => UserRepository.followAccept(targetUserId);
  const followDecline = () => UserRepository.followDecline(targetUserId);
  const deleteFollower = () => UserRepository.deleteFollower(targetUserId);

  return {
    follow,
    followAccept,
    followDecline,
    deleteFollower,
    isFollowNone: followStatus === FollowRequestStatus.None,
    isFollowAccepted: followStatus === FollowRequestStatus.Accepted,
    isFollowPending: followStatus === FollowRequestStatus.Pending,
  };
};

export default useFollow;
