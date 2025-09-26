import { useEffect, useState, useCallback } from 'react';

export function useGetMyJoinRequest(community: Amity.Community) {
  const [myJoinRequest, setMyJoinRequest] = useState<Amity.JoinRequest | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchJoinRequest = useCallback(async () => {
    if (!community || !community.communityId) return;

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
