import React from 'react';

import useOneCommunity from '~/mock/useOneCommunity';
import CommunityHeader from '.';

export default {
  title: 'Components/Community/Header',
  parameters: { layout: 'centered' },
};

export const SDKCommunityHeader = ({ communityId, isActive, isSearchResult, onClick }) => {
  const [community, isLoading] = useOneCommunity(communityId);
  if (isLoading) return <p>Loading...</p>;
  return (
    <CommunityHeader
      communityId={community.communityId}
      isActive={isActive}
      onClick={onClick}
      isSearchResult={isSearchResult}
    />
  );
};

SDKCommunityHeader.args = {
  communityId: '',
  isActive: false,
  isSearchResult: false,
};

SDKCommunityHeader.argTypes = {
  communityId: { control: { type: 'text' } },
  isActive: { control: { type: 'boolean' } },
  isSearchResult: { control: { type: 'boolean' } },
  onClick: { action: 'onClick' },
};
