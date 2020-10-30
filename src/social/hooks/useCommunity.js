import { CommunityRepository } from 'eko-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';
import useLiveCollection from '~/core/hooks/useLiveCollection';
import useFile from '~/core/hooks/useFile';

const useCommunity = communityId => {
  const community = useLiveObject(() => CommunityRepository.communityForId(communityId), [
    communityId,
  ]);

  // Must call this hook even if there is a custom file URL which will override it.
  // Cannot call hooks conditionally due to the 'rules of hooks'.
  let file = useFile(community.avatarFileId, [community.avatarFileId]);

  if (community.avatarCustomUrl) {
    file = { fileUrl: community.avatarCustomUrl };
  }

  const communityCategoryIds = community.categoryIds;
  const [communityCategories] = useLiveCollection(
    () => CommunityRepository.categoriesForIds({ categoryIds: communityCategoryIds }),
    [communityCategoryIds],
  );

  const joinCommunity = () => CommunityRepository.joinCommunity(communityId);
  const leaveCommunity = () => CommunityRepository.leaveCommunity(communityId);

  return {
    community,
    file,
    communityCategories,
    joinCommunity,
    leaveCommunity,
  };
};

export default useCommunity;
