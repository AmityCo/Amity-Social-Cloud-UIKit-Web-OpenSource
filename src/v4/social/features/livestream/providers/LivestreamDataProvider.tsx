import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { useObserveRoomAndInvitation } from '~/v4/social/features/livestream/hooks/useObserveRoomAndInvitation';
import {
  useCoHostPermissionNotification,
  useCurrentUserPermissionSubscription,
} from '~/v4/social/features/livestream/hooks';
import { NotificationAlignment } from '~/v4/core/components/Notification';

// Define the context type for only the data that needs to be passed to nested components
interface LivestreamDataContextType {
  room?: Amity.Room | null;
  channel?: Amity.Channel<'live'> | null;
  invitation?: Amity.Invitation;
  parentPost?: Amity.Post | null;
  livestreamPost?: Amity.Post<'room'> | null;
  setLivestreamPost?: React.Dispatch<React.SetStateAction<Amity.Post<'room'> | null>>;
  // Computed values from room for convenience
  hostId?: string;
  coHostId?: string;

  /**
   * Current user live object, observed for the lifetime of the livestream screen. Emits on
   * `user.updated`, i.e. when a network-scope (Console) permission change lands — the
   * recompute trigger for the permission arm of `canPin` (AmityLivestreamChatFeed v2 REQ-081).
   */
  currentUser?: Amity.User | null;

  host?: Amity.RoomParticipant;
  coHost?: Amity.RoomParticipant;

  // Invitation by Host
  invitationByMe?: Amity.Invitation | undefined;
  setInvitationByMe?: React.Dispatch<React.SetStateAction<Amity.Invitation | undefined>>;

  invitations?: Amity.Invitation[] | undefined;

  notificationAlignment?: NotificationAlignment | undefined;
}

const LivestreamDataContext = createContext<LivestreamDataContextType | null>(null);

interface LivestreamDataProviderProps {
  children: ReactNode;
  room?: Amity.Room | null;
  channel?: Amity.Channel<'live'> | null;
  parentPost?: Amity.Post | null;
  livestreamPost?: Amity.Post<'room'> | null;
  notificationAlignment?: NotificationAlignment;
}

export const LivestreamDataProvider: React.FC<LivestreamDataProviderProps> = ({
  children,
  room,
  channel,
  parentPost,
  livestreamPost,
  notificationAlignment,
}) => {
  // Computed values for easier access
  const host = room?.participants.find((participant) => participant.type === 'host');
  const coHost = room?.participants.find((participant) => participant.type === 'coHost');

  const [livestreamChildPost, setLivestreamChildPost] = useState<Amity.Post<'room'> | null>(
    livestreamPost || null,
  );

  useEffect(() => {
    setLivestreamChildPost(livestreamPost ?? null);
  }, [livestreamPost]);

  const hostId = host?.userId;
  const coHostId = coHost?.userId;

  const { currentUserId } = useSDK();

  const [invitationByMe, setInvitationByMe] = useState<Amity.Invitation>();

  const { invitations } = useObserveRoomAndInvitation({ room });

  // Monitor co-host permission changes and show toast notification
  useCoHostPermissionNotification({
    room,
    notificationAlignment: notificationAlignment ?? 'fullscreen',
  });

  // Subscribe the current user's `.user` topic while the screen is mounted so a network-scope
  // permission revoke (`user.updated`) reaches the SDK cache and `canPin` can hide the pin
  // controls without any user action (Implementation Plan 39 v1.9, UC1-14 / UC2-10).
  const { currentUser } = useCurrentUserPermissionSubscription();

  useEffect(() => {
    if (invitations && invitations.length > 0) {
      const invitedByMe = invitations.find(
        (invitation) => invitation.inviterUserId === currentUserId,
      );

      setInvitationByMe(invitedByMe);
    }
  }, [invitations]);

  const contextValue: LivestreamDataContextType = {
    room,
    channel,
    parentPost,
    livestreamPost: livestreamChildPost,
    setLivestreamPost: setLivestreamChildPost,
    host,
    coHost,
    hostId,
    coHostId,
    currentUser,
    invitations,
    invitationByMe,
    setInvitationByMe,
    notificationAlignment,
  };

  return (
    <LivestreamDataContext.Provider value={contextValue}>{children}</LivestreamDataContext.Provider>
  );
};

// Custom hook to use the context
export const useLivestreamData = (): LivestreamDataContextType => {
  const context = useContext(LivestreamDataContext);
  if (!context) {
    // Return empty object if not in provider context - components should handle null values appropriately
    return {};
  }
  return context;
};
