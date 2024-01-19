import { UserRepository } from '@amityco/ts-sdk';
import { useEffect, useRef, useState } from 'react';

/**
 * Used in Storybook stories only to get a single user that is not the current user.
 * Just takes the first user in the list, and so it could actually be the current user!
 */

const useOneUser = () => {
  const [items, setItems] = useState<Amity.User[]>([]);
  const disposeFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    async function run() {
      if (disposeFnRef.current) {
        disposeFnRef.current();
      }
      disposeFnRef.current = UserRepository.getUsers({}, async (resp) => {
        if (resp.loading) return;
        setItems(resp.data);
      });
    }
    run();

    return () => {
      if (disposeFnRef.current) {
        disposeFnRef.current();
      }
    };
  }, []);

  if (!items || items.length === 0) return null;

  return items[0];
};

export default useOneUser;
