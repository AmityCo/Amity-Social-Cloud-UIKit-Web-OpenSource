import { useEffect, useState } from 'react';
import { CommentRepository, CommentReferenceType } from '@amityco/js-sdk';
import useOnePost from '~/mock/useOnePost';

/**
 * Used in Storybook stories only to get a single comment.
 * Gets an existing comment from a post, or creates a new comment.
 */

const useOneComment = () => {
  const [comment, setComment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [post] = useOnePost();

  useEffect(() => {
    if (!post) return;

    let commentLiveObject;

    if (post.comments.length) {
      commentLiveObject = CommentRepository.commentForId(post.comments[0]);
      commentLiveObject.model && setComment(commentLiveObject.model);
      setIsLoading(false);
    } else {
      commentLiveObject = CommentRepository.createTextComment({
        referenceType: CommentReferenceType.Post,
        referenceId: post.postId,
        text: 'Comment created for story',
      });
    }

    commentLiveObject.on('dataUpdated', (newComment) => {
      setComment(newComment);
      setIsLoading(false);
    });

    return () => commentLiveObject.dispose();
  }, [post]);

  return [comment, isLoading];
};

export default useOneComment;
