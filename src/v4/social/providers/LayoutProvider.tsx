import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { LiveStreamPlayerPageProps } from '~/v4/social/features/livestream/pages/LiveStreamPlayerPage';
import {
  useInvitationNotificationTray,
  InvitationNotificationTray,
  initialInvitationNotificationTray,
  useLinkToPost,
  LinkToPost,
} from '~/v4/social/hooks';
import useSDK from '~/v4/core/hooks/useSDK';

type LocalVideoPost = {
  postId: string;
  videos: {
    fileId: string;
    thumbnailUrl: string | undefined;
  }[];
};

type LayoutContextType = {
  activeTab: HomePageTab;
  prevActiveTab: HomePageTab;
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
  canBeDiscarded: boolean;
  setCanBeDiscarded: (canBeDiscarded: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType>({
  activeTab: HomePageTab.Newsfeed,
  prevActiveTab: HomePageTab.Newsfeed,
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
  canBeDiscarded: true,
  setCanBeDiscarded: () => {},
});

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);

  if (!context) throw new Error('useLayoutContext must be used within a LayoutProvider');

  return context;
};

type LayoutProviderProps = PropsWithChildren<unknown>;

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const { isVisitorOrBot } = useSDK();
  const defaultTab = isVisitorOrBot ? HomePageTab.Communities : HomePageTab.Newsfeed;
  const [activeTab, setActiveTabState] = useState<HomePageTab>(defaultTab);
  const [prevActiveTab, setPrevActiveTab] = useState<HomePageTab>(defaultTab);

  // The `defaultTab` above is only applied on first mount (useState initializer).
  // When the user transitions between visitor and signed-in without remounting
  // this provider (e.g. creating a profile from the visitor create-profile page),
  // realign the active tab to the new default — otherwise a visitor who signs in
  // stays stuck on the Communities tab instead of landing on Newsfeed.
  const prevIsVisitorOrBotRef = useRef(isVisitorOrBot);
  useEffect(() => {
    if (prevIsVisitorOrBotRef.current !== isVisitorOrBot) {
      prevIsVisitorOrBotRef.current = isVisitorOrBot;
      setActiveTabState(defaultTab);
      setPrevActiveTab(defaultTab);
    }
  }, [isVisitorOrBot, defaultTab]);

  const setActiveTab = (tab: HomePageTab) => {
    setPrevActiveTab(activeTab);
    setActiveTabState(tab);
  };
  const [acceptedInvitation, setAcceptedInvitation] = useState<Amity.Invitation | null>(null);
  const [liveStreamPlayer, setStreamPlayer] = useState<LiveStreamPlayerPageProps | null>(null);
  const invitationNotificationTray = useInvitationNotificationTray();
  const { linkToPost, setLinkToPost } = useLinkToPost();
  const [videoThumbnail, setVideoThumbnail] = useState<LocalVideoPost | undefined>(undefined);
  const [canBeDiscarded, setCanBeDiscarded] = useState<boolean>(true);

  return (
    <LayoutContext.Provider
      value={{
        activeTab,
        prevActiveTab,
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
        canBeDiscarded,
        setCanBeDiscarded,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
