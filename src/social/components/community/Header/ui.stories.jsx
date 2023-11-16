import React from 'react';

import StyledCommunityHeader from './styles';

export default {
  title: 'Ui Only/Social/Community',
};

export const UiCommunityHeader = (args) => <StyledCommunityHeader {...args} />;

UiCommunityHeader.storyName = 'Header';

UiCommunityHeader.args = {
  communityId: 'communityId',
  isActive: false,
  avatarFileUrl: 'https://via.placeholder.com/150x150',
  searchInput: '',
  isOfficial: false,
  isPublic: false,
  isSearchResult: false,
  name: 'Community Name',
  loading: false,
};

UiCommunityHeader.argTypes = {
  communityId: { control: { type: 'text' } },
  isActive: { control: { type: 'boolean' } },
  avatarFileUrl: { control: { type: 'text' } },
  onClick: { action: 'onClick()' },
  isOfficial: { control: { type: 'boolean' } },
  isPublic: { control: { type: 'boolean' } },
  isSearchResult: { control: { type: 'boolean' } },
  name: { control: { type: 'text' } },
  searchInput: { control: { type: 'text' } },
  loading: { control: { type: 'boolean' } },
};
