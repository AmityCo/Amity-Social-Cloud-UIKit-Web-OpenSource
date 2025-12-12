import { useEffect } from 'react';
import usePost from '~/v4/core/hooks/objects/usePost';
import { getPostTopic, subscribeTopic } from '@amityco/ts-sdk';

export const usePostSubscription = (postId?: string) => {
  const { post } = usePost(postId);

  useEffect(() => {
    if (post) {
      const unsubscribe = subscribeTopic(getPostTopic(post));
      return () => unsubscribe();
    }
  }, [post]);

  return { post };
};
