import { useState, useEffect, useRef } from 'react';
import { PostRepository } from '@amityco/ts-sdk';

/**
 * Used in Storybook stories only to get a single post for the current user.
 * Will first try to use an existing post, then create a new one if none exist.
 */
const useOnePost = (): [Amity.Post | null, boolean] => {
  const [post, setPost] = useState<Amity.Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const disPoseRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    async function run() {
      try {
        setIsLoading(true);

        if (post == null) {
          const createdPost = await PostRepository.createPost({
            targetId: 'myFeed',
            targetType: 'content',
            data: { text: 'Post created for Story' },
          });
          setPost(createdPost.data);
        }

        const disPoseFn = PostRepository.getPosts(
          { targetId: 'myFeed', targetType: 'content' },
          async (resp) => {
            setPost(resp.data[0]);
          },
        );

        disPoseRef.current = disPoseFn;
      } finally {
        setIsLoading(false);
      }

      return () => {
        disPoseRef.current?.();
      };
    }
    run();
  }, []);

  return [post, isLoading];
};

export default useOnePost;
