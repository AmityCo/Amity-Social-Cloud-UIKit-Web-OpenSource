import { UserRepository } from '@amityco/js-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

const MINIMUM_STRING_LENGTH_TO_TRIGGER_QUERY = 1;

const userRepo = new UserRepository();

const useUserQuery = (term) => {
  const [users, hasMore, loadMore] = useLiveCollection(
    () => userRepo.searchUserByDisplayName(term),
    [term],
    () => !term || term.length < MINIMUM_STRING_LENGTH_TO_TRIGGER_QUERY,
  );

  return [users, hasMore, loadMore];
};

export default useUserQuery;
