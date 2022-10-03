import { CommunityRepository } from '@amityco/js-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';
import useFile from '~/core/hooks/useFile';
import { useActionEvents } from '~/core/providers/ActionProvider';

const useCommunity = (communityId, resolver) => {
  const community = useLiveObject(
    () => CommunityRepository.communityForId(communityId),
    [communityId],
    resolver,
  );
  const actionEvents = useActionEvents();

  // Must call this hook even if there is a custom file URL which will override it.
  // Cannot call hooks conditionally due to the 'rules of hooks'.
  let file = useFile(community.avatarFileId, [community.avatarFileId]);

  if (community.avatarCustomUrl) {
    file = { fileUrl: community.avatarCustomUrl };
  }

  /*
    developer's note: payload is: {
      communityId: string,
      displayName?: string,
      description?: string,
      avatarFileId?: string,
      categories?: string[],
      tags?: string[],
      metadata?: Object,
      isPublic?: boolean,
      postSetting?: boolean,
    }
  */
  const updateCommunity = async (payload) =>
    await CommunityRepository.updateCommunity({
      communityId,
      ...payload,
    });

  const joinCommunity = async () => {
    actionEvents.onCommunityJoin?.({ communityId });
    await CommunityRepository.joinCommunity(communityId);
  };

  const leaveCommunity = async () => {
    actionEvents.onCommunityLeave?.({ communityId });
    await CommunityRepository.leaveCommunity(communityId);
  };

  const closeCommunity = async () => {
    actionEvents.onCommunityClose?.({ communityId });
    await CommunityRepository.closeCommunity(communityId);
  };

  return {
    community,
    file,
    communityCategories: community?.categories ?? [],
    joinCommunity,
    leaveCommunity,
    updateCommunity,
    closeCommunity,
  };
};

export default useCommunity;
