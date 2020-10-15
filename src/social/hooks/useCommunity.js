import { CommunityRepository } from 'eko-sdk';
import useLiveObject from '~/core/hooks/useLiveObject';

export default communityId => {
  return useLiveObject(() => CommunityRepository.communityForId(communityId), [communityId]);
};
