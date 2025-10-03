import { useEffect, useState, useCallback } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';

export function useGetMyJoinRequest(community: Amity.Community) {
  const { isVisitorOrBot } = useSDK();
  const [myJoinRequest, setMyJoinRequest] = useState<Amity.JoinRequest | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchJoinRequest = useCallback(async () => {
    if (!community || !community.communityId || isVisitorOrBot) return;

    setIsLoading(true);
    try {
      const joinRequest = await community.getMyJoinRequest();
      setMyJoinRequest(joinRequest);
    } catch (error) {
      console.error('Error fetching join request:', error);
    } finally {
      setIsLoading(false);
    }
  }, [community]);

  useEffect(() => {
    fetchJoinRequest();
  }, [fetchJoinRequest, community.communityId]);

  return {
    myJoinRequest,
    setMyJoinRequest,
    isLoading,
    refreshJoinRequest: fetchJoinRequest,
  };
}
