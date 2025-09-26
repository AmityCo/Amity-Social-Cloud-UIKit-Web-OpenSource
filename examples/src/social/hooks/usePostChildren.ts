import { useState, useEffect } from 'react';

import { PostRepository } from '@amityco/ts-sdk';

/**
 *
 * @deprecated
 */
const usePostChildren = (postChildrenIds?: string[] | null) => {
  const [childrenPosts, setChildrenPosts] = useState<Amity.Post[]>([]);

  // reset local state when new children are passed
  useEffect(() => setChildrenPosts([]), [postChildrenIds]);

  const addChildPost = (newChildPost: Amity.Post) => {
    const isAlreadyLoaded = childrenPosts.find((child) => child.postId === newChildPost.postId);
    if (isAlreadyLoaded) return;
    setChildrenPosts((prevState) => [...prevState, newChildPost]);
  };

  useEffect(() => {
    if (!postChildrenIds || postChildrenIds.length === 0) return;

    const disposeFns = postChildrenIds.map((childId) =>
      PostRepository.getPost(childId, (response) => {
        if (response.error) return;
        addChildPost(response.data);
      }),
    );

    return () => {
      disposeFns.forEach((disposeFn) => disposeFn());
    };
  }, [postChildrenIds]);

  return childrenPosts;
};

export default usePostChildren;
