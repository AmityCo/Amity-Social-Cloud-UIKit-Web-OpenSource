import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { LiveStreamPlayerPageProps } from '~/v4/social/pages/LiveStreamPlayerPage';
import {
  useInvitationNotificationTray,
  InvitationNotificationTray,
  initialInvitationNotificationTray,
  useLinkToPost,
  LinkToPost,
} from '~/v4/social/hooks';

type LocalVideoPost = {
  postId: string;
  videos: {
    fileId: string;
    thumbnailUrl: string | undefined;
  }[];
};

type LayoutContextType = {
  activeTab: HomePageTab;
  setActiveTab: (tab: HomePageTab) => void;
  liveStreamPlayer: LiveStreamPlayerPageProps | null;
  setStreamPlayer: (props: LiveStreamPlayerPageProps | null) => void;
  acceptedInvitation: Amity.Invitation | null;
  setAcceptedInvitation: (invitation: Amity.Invitation) => void;
  invitationNotificationTray: InvitationNotificationTray;
  linkToPost: LinkToPost | null;
  setLinkToPost: (linkToPost: LinkToPost | null) => void;
  videoThumbnail: LocalVideoPost | undefined;
  setVideoThumbnail: React.Dispatch<React.SetStateAction<LocalVideoPost | undefined>>;
};

const LayoutContext = createContext<LayoutContextType>({
  activeTab: HomePageTab.Newsfeed,
  setActiveTab: () => {},
  liveStreamPlayer: null,
  setStreamPlayer: () => {},
  acceptedInvitation: null,
  setAcceptedInvitation: () => {},
  invitationNotificationTray: initialInvitationNotificationTray,
  linkToPost: null,
  setLinkToPost: () => {},
  videoThumbnail: undefined,
  setVideoThumbnail: () => {},
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
  const { linkToPost, setLinkToPost } = useLinkToPost();
  const [videoThumbnail, setVideoThumbnail] = useState<LocalVideoPost | undefined>(undefined);

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
        linkToPost,
        setLinkToPost,
        videoThumbnail,
        setVideoThumbnail,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
