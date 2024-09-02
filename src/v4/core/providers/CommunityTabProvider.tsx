import React, { createContext, useContext, useState } from 'react';

type CommunityTabContextType = {
  activeTab: 'community_feed' | 'community_pin';
  setActiveTab: (tab: 'community_feed' | 'community_pin') => void;
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
