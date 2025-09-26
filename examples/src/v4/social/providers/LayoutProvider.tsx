import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { LiveStreamPlayerPageProps } from '~/v4/social/pages/LiveStreamPlayerPage';
import {
  useInvitationNotificationTray,
  InvitationNotificationTray,
  initialInvitationNotificationTray,
} from '~/v4/social/hooks';

type LayoutContextType = {
  activeTab: HomePageTab;
  setActiveTab: (tab: HomePageTab) => void;
  liveStreamPlayer: LiveStreamPlayerPageProps | null;
  setStreamPlayer: (props: LiveStreamPlayerPageProps | null) => void;
  acceptedInvitation: Amity.Invitation | null;
  setAcceptedInvitation: (invitation: Amity.Invitation) => void;
  invitationNotificationTray: InvitationNotificationTray;
};

const LayoutContext = createContext<LayoutContextType>({
  activeTab: HomePageTab.Newsfeed,
  setActiveTab: () => {},
  liveStreamPlayer: null,
  setStreamPlayer: () => {},
  acceptedInvitation: null,
  setAcceptedInvitation: () => {},
  invitationNotificationTray: initialInvitationNotificationTray,
});

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);

  if (!context) throw new Error('useLayoutContext must be used within a LayoutProvider');

  return context;
};

type LayoutProviderProps = PropsWithChildren<unknown>;

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<HomePageTab>(HomePageTab.Newsfeed);
  const [acceptedInvitation, setAcceptedInvitation] = useState<Amity.Invitation | null>(null);
  const [liveStreamPlayer, setStreamPlayer] = useState<LiveStreamPlayerPageProps | null>(null);
  const invitationNotificationTray = useInvitationNotificationTray();

  return (
    <LayoutContext.Provider
      value={{
        activeTab,
        setActiveTab,
        liveStreamPlayer,
        setStreamPlayer,
        acceptedInvitation,
        setAcceptedInvitation,
        invitationNotificationTray,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
