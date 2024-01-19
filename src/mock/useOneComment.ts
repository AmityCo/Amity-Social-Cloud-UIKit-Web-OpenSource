import { useEffect, useState } from 'react';
import { CommentRepository } from '@amityco/ts-sdk';
import useOnePost from '~/mock/useOnePost';

/**
 * Used in Storybook stories only to get a single comment.
 * Gets an existing comment from a post, or creates a new comment.
 */

const useOneComment = (): [Amity.Comment | null, boolean] => {
  const [comment, setComment] = useState<Amity.Comment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [post] = useOnePost();

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      if (!post) return;

      if (post.comments.length > 0) {
        const disposeFn = CommentRepository.getComment(post.comments[0], (resp) => {
          setComment(resp.data as Amity.Comment);
          setIsLoading(false);
        });
        return () => disposeFn();
      } else {
        await CommentRepository.createComment({
          referenceType: 'post',
          referenceId: post.postId,
          data: { text: 'Comment created for story' },
        });
        setIsLoading(false);
      }
    }
    run();
  }, [post?.comments]);

  return [comment, isLoading];
};

export default useOneComment;
