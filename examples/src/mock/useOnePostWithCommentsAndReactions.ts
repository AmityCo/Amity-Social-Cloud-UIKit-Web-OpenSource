import { useEffect, useState } from 'react';
import { CommentRepository, ReactionRepository } from '@amityco/ts-sdk';
import useOnePost from '~/mock/useOnePost';

/**
 * Used in Storybook stories only to get a single comment.
 * Gets an existing comment from a post, or creates a new comment.
 */

const useOnePostWithCommentAndReactions = (): [Amity.Post | null, boolean] => {
  const [isLoading, setIsLoading] = useState(true);
  const [post] = useOnePost();
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        setIsLoading(true);
        if (!post) {
          return;
        }
        if (currentPostId === post.postId) {
          return;
        }

        if (currentPostId == null) {
          setCurrentPostId(post.postId);
        }

        await Promise.all(
          Array(10)
            .fill(0)
            .map((_, index) => {
              return CommentRepository.createComment({
                referenceType: 'content',
                referenceId: post.postId,
                data: { text: `Comment #${index + 1} created for story` },
              });
            }),
        );

        await Promise.all(
          Array(3)
            .fill(0)
            .map(() => ReactionRepository.addReaction('post', post.postId, 'like')),
        );
      } finally {
        setIsLoading(false);
      }
    }
    run();
  }, [post?.postId]);

  return [post, isLoading];
};

export default useOnePostWithCommentAndReactions;
