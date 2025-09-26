import { UserRepository } from '@amityco/ts-sdk';

import useFollowStatus from '~/core/hooks/useFollowStatus';

/**
 *
 * @deprecated
 */
const useFollow = (sourceUserId: string, targetUserId: string) => {
  const followStatus = useFollowStatus(sourceUserId);

  const follow = () => UserRepository.Relationship.follow(targetUserId);
  const followAccept = () => UserRepository.Relationship.acceptMyFollower(targetUserId);
  const followDecline = () => UserRepository.Relationship.declineMyFollower(targetUserId);
  const deleteFollower = () => UserRepository.Relationship.unfollow(targetUserId);

  return {
    follow,
    followAccept,
    followDecline,
    deleteFollower,
    isFollowNone: followStatus === 'none',
    isFollowAccepted: followStatus === 'accepted',
    isFollowPending: followStatus === 'pending',
  };
};

export default useFollow;
