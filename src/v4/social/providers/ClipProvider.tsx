import React, { createContext, useContext, useEffect, useState } from 'react';

type ClipContextType = {
  file: File | null | Amity.File;
  setFile: (file: File | null | Amity.File) => void;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  isAspectFill: boolean;
  setIsAspectFill: (isAspectFill: boolean) => void;
  clipThumbnail: string | null;
  setClipThumbnail: (thumbnail: string | null) => void;
};

const ClipContext = createContext<ClipContextType>({
  file: null,
  setFile: () => {},
  isMuted: false,
  setIsMuted: () => {},
  isAspectFill: true,
  setIsAspectFill: () => {},
  clipThumbnail: null,
  setClipThumbnail: () => {},
});

export const useClipContext = () => useContext(ClipContext);

type ClipProviderProps = {
  children: React.ReactNode;
};

export const ClipProvider: React.FC<ClipProviderProps> = ({ children }) => {
  const [file, setFile] = useState<File | Amity.File | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isAspectFill, setIsAspectFill] = useState(true);
  const [clipThumbnail, setClipThumbnail] = useState<string | null>(null);

  const value: ClipContextType = {
    file,
    setFile,
    isMuted,
    setIsMuted,
    isAspectFill,
    setIsAspectFill,
    clipThumbnail,
    setClipThumbnail,
  };

  return <ClipContext.Provider value={value}>{children}</ClipContext.Provider>;
};
