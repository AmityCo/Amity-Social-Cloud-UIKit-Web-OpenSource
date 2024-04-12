import React, { createContext, useContext, useState } from 'react';

type StoryContextType = {
  file: File | null;
  setFile: (file: File | null) => void;
};

const StoryContext = createContext<StoryContextType>({
  file: null,
  setFile: () => {},
});

export const useStoryContext = () => useContext(StoryContext);

type StoryProviderProps = {
  children: React.ReactNode;
};

export const StoryProvider: React.FC<StoryProviderProps> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);

  const value: StoryContextType = {
    file,
    setFile,
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};
