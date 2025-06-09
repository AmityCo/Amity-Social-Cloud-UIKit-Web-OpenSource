import { useEffect, useState } from 'react';

export function useGetMyJoinRequest(community: Amity.Community) {
  const [myJoinRequest, setMyJoinRequest] = useState<Amity.JoinRequest | undefined>();

  useEffect(() => {
    community.getMyJoinRequest().then((joinRequest) => {
      setMyJoinRequest(joinRequest);
    });
  }, [community.communityId]);

  return {
    myJoinRequest,
    setMyJoinRequest,
  };
}
