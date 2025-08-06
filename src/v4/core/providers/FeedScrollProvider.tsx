import React, { createContext, useContext, useState } from 'react';

const useFeedScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setScrollPosition(target.scrollTop);
  };

  return {
    scrollPosition,
    onScroll,
  };
};

type FeedScrollContextType = ReturnType<typeof useFeedScroll>;

const FeedScrollContext = createContext<FeedScrollContextType>({
  scrollPosition: 0,
  onScroll: () => {},
});

export const useFeedScrollContext = () => {
  const context = useContext(FeedScrollContext);
  if (!context) {
    throw new Error('useFeedScrollContext must be used within a FeedScrollProvider');
  }
  return context;
};

type FeedScrollProviderProps = {
  children: React.ReactNode;
};

export const FeedScrollProvider: React.FC<FeedScrollProviderProps> = ({ children }) => {
  const value = useFeedScroll();

  return <FeedScrollContext.Provider value={value}>{children}</FeedScrollContext.Provider>;
};
