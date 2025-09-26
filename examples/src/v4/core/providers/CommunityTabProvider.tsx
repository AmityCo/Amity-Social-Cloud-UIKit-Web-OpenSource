import React, { createContext, useContext, useState } from 'react';

export type CommunityTab =
  | 'community_feed'
  | 'community_pin'
  | 'community_image_feed'
  | 'community_video_feed';

type CommunityTabContextType = {
  activeTab: CommunityTab;
  setActiveTab: (tab: CommunityTab) => void;
};

const CommunityTabContext = createContext<CommunityTabContextType>({
  activeTab: 'community_feed',
  setActiveTab: () => {},
});

export const useCommunityTabContext = () => useContext(CommunityTabContext);

type CommunityTabProviderProps = {
  children: React.ReactNode;
};

export const CommunityTabProvider: React.FC<CommunityTabProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] =
    useState<CommunityTabContextType['activeTab']>('community_feed');

  const value: CommunityTabContextType = {
    activeTab,
    setActiveTab,
  };

  return <CommunityTabContext.Provider value={value}>{children}</CommunityTabContext.Provider>;
};
