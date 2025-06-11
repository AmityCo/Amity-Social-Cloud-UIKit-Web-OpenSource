import { JoinRequestStatusEnum } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

export function useGetJoinRequests(community?: Amity.Community) {
  const [joinRequests, setJoinRequests] = useState<Amity.JoinRequest[] | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (community === undefined || !community.communityId) return;
    setIsLoading(true);
    const unsubscribe = community.getJoinRequests(
      {
        communityId: community.communityId,
        type: 'communityJoinRequest',
        targetType: 'community',
        status: JoinRequestStatusEnum.Pending,
        options: {
          limit: 20,
        },
      },
      ({ data }) => setJoinRequests(data),
    );
    setIsLoading(false);

    return () => unsubscribe();
  }, [community?.communityId]);

  return {
    joinRequests,
    isLoading,
  };
}
