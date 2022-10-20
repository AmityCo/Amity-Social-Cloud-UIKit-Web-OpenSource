import { UserRepository } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

/**
 * Used in Storybook stories only to get a single user that is not the current user.
 * Just takes the first user in the list, and so it could actually be the current user!
 */

const useOneUser = () => {
  const [users] = useLiveCollection(() => UserRepository.queryUsers());
  return users[0] || { userId: 'random-user-id' };
};

export default useOneUser;
