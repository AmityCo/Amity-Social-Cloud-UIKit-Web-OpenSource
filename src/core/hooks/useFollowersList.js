import { UserRepository } from '@amityco/js-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

const useFollowersList = (userId, status) => {
  return useLiveCollection(
    () => UserRepository.getFollowers(userId, status),
    [userId, status],
    () => !userId,
  );
};

export default useFollowersList;
