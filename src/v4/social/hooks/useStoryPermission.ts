import { useUser } from '~/v4/core/hooks/objects/useUser';
import useSDK from '~/v4/core/hooks/useSDK';
import useSocialSettings from '~/v4/social/hooks/useSocialSettings';
import { checkStoryPermission, isAdmin, isModerator } from '~/v4/social/utils';

export function useStoryPermission(communityId?: string) {
  const { client, isVisitorOrBot } = useSDK();
  const { socialSettings } = useSocialSettings();
  const { user } = useUser({ userId: client?.userId, shouldCall: !isVisitorOrBot });

  const isGlobalAdmin = isAdmin(user?.roles);

  const hasStoryPermission = !communityId
    ? socialSettings?.story?.allowAllUserToCreateStory
    : socialSettings?.story?.allowAllUserToCreateStory ||
      isGlobalAdmin ||
      checkStoryPermission(client, communityId);

  return { hasStoryPermission };
}
