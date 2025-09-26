import { UserRepository } from '@amityco/ts-sdk';
import { useState } from 'react';
import useLiveObject from '~/v4/core/hooks/useLiveObject';

const useFollowCount = (userId?: string | null) => {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followStatus, setFollowStatus] = useState<Amity.FollowStatus['status'] | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useLiveObject({
    fetcher: UserRepository.Relationship.getFollowInfo,
    params: userId,
    callback: (response) => {
      if (!response.data) return;
      setFollowerCount(response.data.followerCount);
      setFollowingCount(response.data.followingCount);
      setPendingCount(response.data.pendingCount);
      if (response.data.status) setFollowStatus(response.data.status);
    },
    shouldCall: !!userId,
  });

  return { followerCount, followingCount, pendingCount, followStatus };
};

export default useFollowCount;
