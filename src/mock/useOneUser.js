import { UserRepository } from 'eko-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

/**
 * Used in Storybook stories only to get a single user that is not the current user.
 * Just takes the first user in the list, and so it could actually be the current user!
 */

const userRepo = new UserRepository();

const useOneUser = () => {
  const [users] = useLiveCollection(() => userRepo.getAllUsers());
  return users[0] || { userId: 'random-user-id' };
};

export default useOneUser;
