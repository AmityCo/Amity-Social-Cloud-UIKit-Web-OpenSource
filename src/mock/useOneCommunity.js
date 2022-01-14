import { useState, useEffect } from 'react';
import { CommunityRepository, LoadingStatus } from '@amityco/js-sdk';

/**
 * Used in Storybook stories only to get a single community and its avatar URL.
 * If a communityId argument is provided, it will return that community, otherwise return a random community.
 */
const useOneCommunity = (communityId = null) => {
  const [community, setCommunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let communitiesLiveCollection;
    let communitiesLiveObject;

    if (communityId) {
      communitiesLiveObject = CommunityRepository.communityForId(communityId);
      if (communitiesLiveObject.model) {
        setCommunity(communitiesLiveObject.model);
        setIsLoading(false);
      }
      communitiesLiveObject.on('dataUpdated', (newCommunity) => {
        setCommunity(newCommunity);
        setIsLoading(false);
      });
    } else {
      communitiesLiveCollection = CommunityRepository.allCommunitiesWithFilters();
      communitiesLiveCollection.once('loadingStatusChanged', ({ newValue }) => {
        if (newValue !== LoadingStatus.Loaded) return;
        if (communitiesLiveCollection.models.length) {
          setCommunity(communitiesLiveCollection.models[0]);
          setIsLoading(false);
        }
      });
    }

    return () => {
      communitiesLiveCollection && communitiesLiveCollection.dispose();
      communitiesLiveObject && communitiesLiveObject.dispose();
    };
  }, [communityId]);

  return [community, isLoading];
};

export default useOneCommunity;
