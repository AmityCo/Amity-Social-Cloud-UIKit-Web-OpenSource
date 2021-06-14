import React from 'react';

import CommunityName from '.';

export default {
  title: 'Ui Only/Social/Community',
};

export const UiCommunityName = props => <CommunityName {...props} />;

UiCommunityName.storyName = 'Name';

UiCommunityName.args = {
  name: 'Test Community',
  isOfficial: false,
  isPublic: true,
  isActive: false,
  isTitle: false,
  isSearchResult: false,
  searchInput: '',
};

UiCommunityName.argTypes = {
  name: { control: { type: 'text' } },
  isOfficial: { control: { type: 'boolean' } },
  isPublic: { control: { type: 'boolean' } },
  isActive: { control: { type: 'boolean' } },
  isTitle: { control: { type: 'boolean' } },
  isSearchResult: { control: { type: 'boolean' } },
  searchInput: { control: { type: 'text' } },
};
