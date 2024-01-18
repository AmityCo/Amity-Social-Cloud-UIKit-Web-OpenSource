import React from 'react';

import UiKitSocialSearch from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKSearch = ({ ...args }) => <UiKitSocialSearch {...args} />;

SDKSearch.storyName = 'Search bar';

SDKSearch.args = {
  placeholder: 'Search communities',
};

SDKSearch.argTypes = {
  placeholder: { control: { type: 'text' } },
  onSearchResultCommunityClick: { action: 'onSearchResultCommunityClick()' },
};
