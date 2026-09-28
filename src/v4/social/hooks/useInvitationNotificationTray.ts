import { useEffect, useState } from 'react';
import { InvitationRepository } from '@amityco/ts-sdk';
import useSDK from '~/v4/core/hooks/useSDK';
import { useSdkEffect } from '~/v4/core/hooks/useSdkEffect';

export type InvitationNotificationTray = {
  invitations: Amity.Invitation[];
  isLoading: boolean;
  refresh: () => void;
  hasUnseenInvitations: boolean;
};

export const initialInvitationNotificationTray: InvitationNotificationTray = {
  invitations: [],
  isLoading: false,
  refresh: () => {},
  hasUnseenInvitations: false,
};

// const POLLING_ONE_MINUTE_INTERVAL = 60 * 1000;

export function useInvitationNotificationTray(): InvitationNotificationTray {
  const { isVisitorOrBot } = useSDK();
  const [tray, setTray] = useState<InvitationNotificationTray>(initialInvitationNotificationTray);

  useSdkEffect(
    InvitationRepository.getMyCommunityInvitations,
    () => {
      if (isVisitorOrBot) {
        setTray(initialInvitationNotificationTray);
        return;
      }

      let unsubscribe: (() => void) | undefined;

      const getTray = () => {
        if (unsubscribe) unsubscribe();

        unsubscribe = InvitationRepository.getMyCommunityInvitations(
          { limit: 20 },
          ({ data, loading }) => {
            setTray((prev) => {
              return {
                invitations: data,
                isLoading: loading,
                refresh: getTray,
                hasUnseenInvitations: !loading
                  ? data.slice(0, 3).some((item) => !localStorage.getItem(item.invitationId))
                  : prev.hasUnseenInvitations,
              };
            });
          },
        );
      };

      getTray();

      // const intervalId = setInterval(getTray, POLLING_ONE_MINUTE_INTERVAL);

      return () => {
        if (unsubscribe) unsubscribe();
        // clearInterval(intervalId);
      };
    },
    [isVisitorOrBot],
  );

  return tray;
}
