import { useState } from 'react';

const usePostsMock = (initialPosts = []) => {
  const [posts, setPosts] = useState(initialPosts);

  const addPost = newPost => setPosts([newPost, ...posts]);
  const removePost = postId => setPosts(posts.filter(({ id }) => id !== postId));

  const editPost = updatedPost =>
    setPosts(posts.map(post => (post.id === updatedPost.id ? updatedPost : post)));

  return { posts, addPost, removePost, editPost };
};

export default usePostsMock;
