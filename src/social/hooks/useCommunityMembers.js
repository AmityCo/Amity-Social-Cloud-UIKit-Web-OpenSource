import { CommunityRepository } from 'eko-sdk';
import useCommunity from '~/social/hooks/useCommunity';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCommunityMembers = communityId => {
  const { community } = useCommunity(communityId);
  const [members, hasMoreMembers, loadMoreMembers] = useLiveCollection(
    () => CommunityRepository.getCommunityMembers({ communityId }),
    [communityId],
  );
  return {
    members,
    hasMoreMembers,
    loadMoreMembers,
    membersCount: community.membersCount,
  };
};

export default useCommunityMembers;
