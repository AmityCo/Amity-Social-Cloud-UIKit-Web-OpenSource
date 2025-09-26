import React from 'react';

import CommunityName from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Social/Community',
};

export const UiCommunityName = {
  render: () => {
    const [props] = useArgs();
    return <CommunityName {...props} />;
  },
  name: 'Name',

  args: {
    name: 'Test Community',
    isOfficial: false,
    isPublic: true,
    isActive: false,
    isTitle: false,
    isSearchResult: false,
    searchInput: '',
  },

  argTypes: {
    name: { control: { type: 'text' } },
    isOfficial: { control: { type: 'boolean' } },
    isPublic: { control: { type: 'boolean' } },
    isActive: { control: { type: 'boolean' } },
    isTitle: { control: { type: 'boolean' } },
    isSearchResult: { control: { type: 'boolean' } },
    searchInput: { control: { type: 'text' } },
  },
};
