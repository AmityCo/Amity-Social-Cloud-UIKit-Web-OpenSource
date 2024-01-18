import { UserRepository } from '@amityco/js-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

const useFollowingsList = (userId, status) => {
  return useLiveCollection(
    () => UserRepository.getFollowings(userId, status),
    [userId, status],
    () => !userId,
  );
};

export default useFollowingsList;
