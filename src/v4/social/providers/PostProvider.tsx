import React, { createContext, useContext, useState } from 'react';

type PostContextType = {
  post: Amity.Post | null;
  setPost: (post: Amity.Post) => void;
};

const PostContext = createContext<PostContextType>({
  post: null,
  setPost: () => {},
});

export const usePostContext = () => useContext(PostContext);

type PostProviderProps = {
  children: React.ReactNode;
};

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [post, setPost] = useState<Amity.Post | null>(null);

  const value: PostContextType = {
    post,
    setPost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
