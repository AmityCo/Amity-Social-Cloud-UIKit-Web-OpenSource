import { useState, useEffect } from 'react';

import { PostRepository } from 'eko-sdk';

const usePostChildren = postChildrenIds => {
  const [childrenPosts, setChildrenPosts] = useState([]);

  // reset local state when new children are passed
  useEffect(() => setChildrenPosts([]), [postChildrenIds]);

  const addChildPost = newChildPost => {
    const isAlreadyLoaded = childrenPosts.find(child => child.postId === newChildPost.postId);
    if (isAlreadyLoaded) return;
    setChildrenPosts(prevState => [...prevState, newChildPost]);
  };

  postChildrenIds.forEach(childId => {
    const childPostLiveObject = PostRepository.postForId(childId);

    // Crucial to use an if/else here and not try both.
    // With both we end up with duplicates despite the addChildPost function attempting to check for duplicates.
    if (childPostLiveObject.model) {
      addChildPost(childPostLiveObject.model);
    } else {
      childPostLiveObject.on('dataUpdated', childPost => {
        addChildPost(childPost);
      });
      return childPostLiveObject?.dispose();
    }
  });

  return childrenPosts;
};

export default usePostChildren;
