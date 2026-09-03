import { useMemo } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { Permissions } from '~/v4/social/constants/permissions';

export const useChannelPermission = (subChannelId?: Amity.SubChannel['subChannelId']) => {
  const { client } = useSDK();

  return useMemo(() => {
    const check = (perm: string) => {
      if (!client || !subChannelId) return false;
      return (
        client.hasPermission(perm).currentUser() ||
        client.hasPermission(perm).channel(subChannelId) ||
        false
      );
    };

    return {
      isModerator: check(Permissions.MuteChannelPermission),
      canEditChannel: check(Permissions.EditChannelPermission),
      canAddMember: check(Permissions.AddChannelUserPermission),
      canPromote: check(Permissions.EditChannelUserPermission),
      canRemove: check(Permissions.RemoveChannelUserPermission),
      canMute: check(Permissions.MuteUserInsideChannelPermission),
      canBan: check(Permissions.BanUserFromChannelPermission),
      canDeleteMessage: check(Permissions.DeleteMessagePermission),
    };
  }, [client, subChannelId]);
};
