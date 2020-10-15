import React from 'react';

import useOneCommunity from '~/mock/useOneCommunity';
import CommunityName, { UICommunityName as CommunityNameComponent } from '.';

export default {
  title: 'Components/Community/Name',
  parameters: { layout: 'centered' },
};

export const UICommunityName = props => <CommunityNameComponent {...props} />;

UICommunityName.args = {
  name: 'Test Community',
  isOfficial: false,
  isPublic: true,
  isActive: false,
  isTitle: false,
};

UICommunityName.argTypes = {
  name: { control: { type: 'text' } },
  isOfficial: { control: { type: 'boolean' } },
  isPublic: { control: { type: 'boolean' } },
  isActive: { control: { type: 'boolean' } },
  isTitle: { control: { type: 'boolean' } },
};

export const SDKCommunityName = ({ communityId, isActive, isSearchResult }) => {
  const [community, isLoading] = useOneCommunity(communityId);
  if (isLoading) return <p>Loading...</p>;
  return (
    <CommunityName
      communityId={community.communityId}
      isActive={isActive}
      isSearchResult={isSearchResult}
    />
  );
};

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
