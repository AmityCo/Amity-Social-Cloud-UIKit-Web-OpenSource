import { useState, useEffect, useRef } from 'react';
import { CommunityRepository } from '@amityco/ts-sdk';

/**
 * Used in Storybook stories only to get a single community and its avatar URL.
 * If a communityId argument is provided, it will return that community, otherwise return a random community.
 */
const useOneCommunity = (communityId?: string): [Amity.Community | null | undefined, boolean] => {
  const [community, setCommunity] = useState<Amity.Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const disposeFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      if (disposeFnRef.current) {
        disposeFnRef.current();
      }
      if (communityId) {
        const disposeFn = CommunityRepository.getCommunity(communityId, async (resp) => {
          setCommunity(resp.data);
          setIsLoading(false);
        });
        disposeFnRef.current = disposeFn;
      } else {
        const disposeFn = CommunityRepository.getCommunities({}, async (resp) => {
          setCommunity(resp.data[0]);
          setIsLoading(false);
        });
        disposeFnRef.current = disposeFn;
      }

      return () => {
        if (disposeFnRef.current) {
          disposeFnRef.current();
        }
      };
    }
    run();
  }, []);

  return [community, isLoading];
};

export default useOneCommunity;
