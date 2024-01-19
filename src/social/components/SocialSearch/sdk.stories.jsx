import React from 'react';

import UiKitSocialSearch from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKSearch = {
  render: () => {
    const [props] = useArgs();
    return <UiKitSocialSearch {...props} />;
  },
  name: 'Search bar',

  args: {
    placeholder: 'Search communities',
  },

  argTypes: {
    placeholder: { control: { type: 'text' } },
    onSearchResultCommunityClick: { action: 'onSearchResultCommunityClick()' },
  },
};
