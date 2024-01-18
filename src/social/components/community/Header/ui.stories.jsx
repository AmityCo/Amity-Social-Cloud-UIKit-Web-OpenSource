import React from 'react';

import StyledCommunityHeader from './UICommunityHeader';

export default {
  title: 'Ui Only/Social/Community',
};

export const UiCommunityHeader = {
  render: (props) => {
    return <StyledCommunityHeader {...props} />;
  },
  name: 'Header',

  args: {
    communityId: 'communityId',
    isActive: false,
    avatarFileUrl: 'https://via.placeholder.com/150x150',
    searchInput: '',
    isOfficial: false,
    isPublic: false,
    isSearchResult: false,
    name: 'Community Name',
    loading: false,
  },

  argTypes: {
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
  },
};
