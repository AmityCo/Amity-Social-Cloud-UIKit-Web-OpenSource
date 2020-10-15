import { CommunityRepository } from 'eko-sdk';
import useLiveObject from '~/core/hooks/useLiveObject';
import useLiveCollection from '~/core/hooks/useLiveCollection';

export default communityId => {
  const community = useLiveObject(() => CommunityRepository.communityForId(communityId), [
    communityId,
  ]);

  const communityCategoryIds = community.categoryIds;
  const [communityCategories] = useLiveCollection(
    () => CommunityRepository.categoriesForIds({ categoryIds: communityCategoryIds }),
    [communityCategoryIds],
  );

  const joinCommunity = () => CommunityRepository.joinCommunity(communityId);
  const leaveCommunity = () => CommunityRepository.leaveCommunity(communityId);

  return {
    community,
    communityCategories,
    joinCommunity,
    leaveCommunity,
  };
};
