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
  const updateCommunity = (payload) =>
    CommunityRepository.updateCommunity({
      communityId,
      ...payload,
    });

  const joinCommunity = () => {
    actionEvents.onCommunityJoin?.({ communityId });
    CommunityRepository.joinCommunity(communityId);
  };

  const leaveCommunity = () => {
    actionEvents.onCommunityLeave?.({ communityId });
    CommunityRepository.leaveCommunity(communityId);
  };

  const closeCommunity = () => {
    actionEvents.onCommunityClose?.({ communityId });
    CommunityRepository.closeCommunity(communityId);
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
