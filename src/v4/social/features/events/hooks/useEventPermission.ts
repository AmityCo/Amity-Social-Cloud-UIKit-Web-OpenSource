import useSDK from '~/v4/core/hooks/useSDK';
import { Permissions } from '~/v4/social/constants/permissions';

export function useEventPermission(communityId?: string) {
  const { client, isVisitorOrBot } = useSDK();

  const hasCreateEventPermission = isVisitorOrBot
    ? false
    : client?.hasPermission(Permissions.CreateEventPermission).currentUser()
      ? true
      : communityId
        ? client?.hasPermission(Permissions.CreateEventPermission).community(communityId)
        : false;

  const hasDeleteEventPermission = isVisitorOrBot
    ? false
    : client?.hasPermission(Permissions.DeleteEventPermission).currentUser()
      ? true
      : communityId
        ? client?.hasPermission(Permissions.DeleteEventPermission).community(communityId)
        : false;

  const hasUpdateEventPermission = isVisitorOrBot
    ? false
    : client?.hasPermission(Permissions.UpdateEventPermission).currentUser()
      ? true
      : communityId
        ? client?.hasPermission(Permissions.UpdateEventPermission).community(communityId)
        : false;

  return { hasCreateEventPermission, hasDeleteEventPermission, hasUpdateEventPermission };
}
