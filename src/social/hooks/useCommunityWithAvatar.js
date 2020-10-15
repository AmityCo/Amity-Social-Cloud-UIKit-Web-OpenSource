import useFile from '~/core/hooks/useFile';
import useCommunity from '~/social/hooks/useCommunity';

export default communityId => {
  const community = useCommunity(communityId);
  const file = useFile(community.avatarFileId, [community.avatarFileId]);
  return { community, file };
};
