import { UserRepository } from '@amityco/ts-sdk';
import { useState } from 'react';
import useLiveObject from './useLiveObject';

const useFollowCount = (userId?: string | null) => {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useLiveObject({
    fetcher: UserRepository.Relationship.getFollowInfo,
    params: userId,
    callback: (response) => {
      if (!response.data) return;
      setFollowerCount(response.data.followerCount);
      setFollowingCount(response.data.followingCount);
      setPendingCount(response.data.pendingCount);
    },
    shouldCall: () => !!userId,
  });

  return { followerCount, followingCount, pendingCount };
};

export default useFollowCount;
