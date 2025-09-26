import { PostRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

const usePostByIds = (postIds: Parameters<typeof PostRepository.getPostByIds>[0]) => {
  const [posts, setPosts] = useState<Amity.Post[]>([]);

  useEffect(() => {
    async function run() {
      if (!postIds || postIds?.length === 0) {
        setPosts([]);
      } else {
        const response = await PostRepository.getPostByIds(postIds);
        setPosts(response.data);
      }
    }
    run();
  }, [postIds]);

  return posts;
};

export default usePostByIds;
