import React from 'react';

import useOneCommunity from '~/mock/useOneCommunity';

import UiKitCommunityName from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityName = ({ communityId, isActive, isSearchResult }) => {
  const [community, isLoading] = useOneCommunity(communityId);
  if (isLoading) return <p>Loading...</p>;
  return (
    <UiKitCommunityName
      communityId={community.communityId}
      isActive={isActive}
      isSearchResult={isSearchResult}
    />
  );
};

SDKCommunityName.storyName = 'Name';

SDKCommunityName.args = {
  communityId: '',
  isActive: false,
  isSearchResult: false,
  isTitle: false,
};

SDKCommunityName.argTypes = {
  communityId: { control: { type: 'text' } },
  isActive: { control: { type: 'boolean' } },
  isSearchResult: { control: { type: 'boolean' } },
  isTitle: { control: { type: 'boolean' } },
};
