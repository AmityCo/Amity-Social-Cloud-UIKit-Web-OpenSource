import { UserRepository } from '@amityco/ts-sdk';

import useUsersCollection from './collections/useAllUsersCollection';

const useAllUsers = () => {
  const { users, hasMore, loadMore } = useUsersCollection();

  return [users, hasMore, loadMore];
};

export default useAllUsers;
