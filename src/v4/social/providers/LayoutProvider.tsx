import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { LiveStreamPlayerPageProps } from '~/v4/social/pages/LiveStreamPlayerPage';

type LayoutContextType = {
  activeTab: HomePageTab;
  setActiveTab: (tab: HomePageTab) => void;
  liveStreamPlayer: LiveStreamPlayerPageProps | null;
  setStreamPlayer: (props: LiveStreamPlayerPageProps | null) => void;
};

const LayoutContext = createContext<LayoutContextType>({
  activeTab: HomePageTab.Newsfeed,
  setActiveTab: () => {},
  liveStreamPlayer: null,
  setStreamPlayer: () => {},
});

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);

  if (!context) throw new Error('useLayoutContext must be used within a LayoutProvider');

  return context;
};

type LayoutProviderProps = PropsWithChildren<unknown>;

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<HomePageTab>(HomePageTab.Newsfeed);
  const [liveStreamPlayer, setStreamPlayer] = useState<LiveStreamPlayerPageProps | null>(null);

  return (
    <LayoutContext.Provider value={{ activeTab, setActiveTab, liveStreamPlayer, setStreamPlayer }}>
      {children}
    </LayoutContext.Provider>
  );
};
