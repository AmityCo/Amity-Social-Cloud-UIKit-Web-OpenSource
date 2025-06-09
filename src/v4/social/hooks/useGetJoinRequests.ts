import { JoinRequestStatusEnum } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

export function useGetJoinRequests(community?: Amity.Community) {
  const [joinRequests, setJoinRequests] = useState<Amity.JoinRequest[] | undefined>();

  useEffect(() => {
    if (community === undefined || !community.communityId) return;
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

    return () => unsubscribe();
  }, [community?.communityId]);

  return {
    joinRequests,
  };
}
