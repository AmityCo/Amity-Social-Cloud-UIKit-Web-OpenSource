import { useUser } from '~/v4/core/hooks/objects/useUser';
import useSDK from '~/v4/core/hooks/useSDK';
import useSocialSettings from '~/v4/social/hooks/useSocialSettings';
import { checkStoryPermission, isAdmin, isModerator } from '~/v4/social/utils';

export function useStoryPermission(communityId?: string) {
  const { client } = useSDK();
  const { socialSettings } = useSocialSettings();
  const { user } = useUser({ userId: client?.userId });

  const isGlobalAdmin = isAdmin(user?.roles);
  const isModeratorUser = isModerator(user?.roles);

  const hasStoryPermission = !communityId
    ? socialSettings?.story?.allowAllUserToCreateStory
    : socialSettings?.story?.allowAllUserToCreateStory ||
      isGlobalAdmin ||
      isModeratorUser ||
      checkStoryPermission(client, communityId);

  return { hasStoryPermission };
}
