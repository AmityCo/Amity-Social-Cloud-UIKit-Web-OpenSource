import useFile from '~/core/hooks/useFile';
import useCommunity from '~/social/hooks/useCommunity';

export default communityId => {
  const { community, communityCategories, joinCommunity, leaveCommunity } = useCommunity(
    communityId,
  );

  const file = useFile(community.avatarFileId, [community.avatarFileId]);
  return { community, communityCategories, joinCommunity, leaveCommunity, file };
};
