import { useState, useEffect } from 'react';
import { useGlobalFeedCollection } from '~/v4/social/hooks/collections/useGlobalFeedCollection';
import useCommentsCollection from '~/v4/social/hooks/collections/useCommentsCollection';

// Inner hook that fetches a comment given a postId
function useFirstComment(postId: string | null): Amity.Comment | null {
  const { comments } = useCommentsCollection({
    referenceId: postId,
    referenceType: 'post',
    shouldCall: !!postId,
  });
  return comments[0] ?? null;
}

export default function useOneComment(): [Amity.Comment | null] {
  const { posts } = useGlobalFeedCollection();
  const firstPostId = posts[0]?.postId ?? null;
  const comment = useFirstComment(firstPostId);
  return [comment];
}
