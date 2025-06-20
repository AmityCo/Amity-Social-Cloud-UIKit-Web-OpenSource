import { CommunityRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

export function useGetJoinRequestList(communityIds: string[]) {
  const [joinRequestList, setJoinRequestList] = useState<Amity.JoinRequest[] | undefined>();

  useEffect(() => {
    if (communityIds.length === 0) return;

    const unsubscribe = CommunityRepository.getJoinRequestList({ communityIds }, ({ data }) => {
      setJoinRequestList(data);
    });

    return () => unsubscribe();
  }, [JSON.stringify(communityIds)]);

  return {
    joinRequestList,
  };
}
