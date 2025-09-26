import React, { createContext, useContext, useEffect, useState } from 'react';

type StoryContextType = {
  file: File | null;
  setFile: (file: File | null) => void;
  isStoryUploading: boolean;
  setIsStoryUploading: (isUploading: boolean) => void;
};

const StoryContext = createContext<StoryContextType>({
  file: null,
  setFile: () => {},
  isStoryUploading: false,
  setIsStoryUploading: () => {},
});

export const useStoryContext = () => useContext(StoryContext);

type StoryProviderProps = {
  children: React.ReactNode;
};

export const StoryProvider: React.FC<StoryProviderProps> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isStoryUploading, setIsStoryUploading] = useState(false);

  const value: StoryContextType = {
    file,
    setFile,
    isStoryUploading,
    setIsStoryUploading,
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};
