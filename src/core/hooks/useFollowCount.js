import { UserRepository } from '@amityco/js-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

const useFollowCount = (userId) => {
  const data = useLiveObject(() => UserRepository.getFollowCount(userId), [userId]);

  const { followerCount = 0, followingCount = 0, pendingCount = 0 } = data || {};

  return { followerCount, followingCount, pendingCount };
};

export default useFollowCount;
