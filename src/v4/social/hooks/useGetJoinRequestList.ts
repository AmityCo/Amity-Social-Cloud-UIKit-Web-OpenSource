import { CommunityRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

interface UseGetJoinRequestListParams {
  communityIds: string[];
  enabled?: boolean;
}

export function useGetJoinRequestList({
  communityIds,
  enabled = true,
}: UseGetJoinRequestListParams) {
  const [joinRequestList, setJoinRequestList] = useState<Amity.JoinRequest[] | undefined>();

  useEffect(() => {
    if (!enabled || communityIds.length === 0) return;

    const unsubscribe = CommunityRepository.getJoinRequestList({ communityIds }, ({ data }) => {
      setJoinRequestList(data);
    });

    return () => unsubscribe();
  }, [JSON.stringify(communityIds), enabled]);

  return {
    joinRequestList,
  };
}
