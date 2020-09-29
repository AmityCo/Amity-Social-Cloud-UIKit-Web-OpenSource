import { useEffect, useState } from 'react';
import useOnePost from 'hooks/useOnePost';
import { CommentRepository, EkoCommentReferenceType } from 'eko-sdk';

/**
 * Used in Storybook stories only to get a single comment.
 * Gets an existing comment from a post, or creates a new comment.
 */

const commentRepo = new CommentRepository();

const useOneComment = () => {
  const [comment, setComment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [post] = useOnePost();

  useEffect(() => {
    if (!post) return;

    let commentLiveObject;

    if (post.comments.length) {
      commentLiveObject = commentRepo.commentForId(post.comments[0]);
      commentLiveObject.model && setComment(commentLiveObject.model);
      setIsLoading(false);
    } else {
      commentLiveObject = commentRepo.createTextComment({
        referenceType: EkoCommentReferenceType.Post,
        referenceId: post.postId,
        text: 'Comment created for story',
      });
    }

    commentLiveObject.on('dataUpdated', newComment => {
      setComment(newComment);
      setIsLoading(false);
    });

    return () => commentLiveObject.dispose();
  }, [post]);

  return [comment, isLoading];
};

export default useOneComment;
