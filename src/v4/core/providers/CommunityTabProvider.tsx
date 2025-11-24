import React, { createContext, useContext, useState } from 'react';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';

export type CommunityTab =
  | 'community_feed'
  | 'community_pin'
  | 'community_event_feed'
  | 'community_media_feed';

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
  const { linkToPost } = useLayoutContext();
  const [activeTab, setActiveTab] = useState<CommunityTabContextType['activeTab']>(
    linkToPost?.tab === 'community_feed' ||
      linkToPost?.tab === 'community_pin' ||
      linkToPost?.tab === 'community_event_feed' ||
      linkToPost?.tab === 'community_media_feed'
      ? linkToPost?.tab
      : 'community_feed',
  );

  const value: CommunityTabContextType = {
    activeTab,
    setActiveTab,
  };

  return <CommunityTabContext.Provider value={value}>{children}</CommunityTabContext.Provider>;
};
