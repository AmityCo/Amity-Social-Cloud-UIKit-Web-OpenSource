import React from 'react';

import UiKitCommunity from '.';

export default {
  title: 'SDK Connected/Social/App',
};

export const SDKCommunity = args => {
  return <UiKitCommunity {...args} />;
};

SDKCommunity.storyName = 'v2 (new)';

SDKCommunity.args = {
  shouldHideExplore: false,
  shouldHideTabs: false,
  showCreateCommunityButton: true,
};

SDKCommunity.argTypes = {
  shouldHideExplore: { control: { type: 'boolean' } },
  shouldHideTabs: { control: { type: 'boolean' } },
  showCreateCommunityButton: { control: { type: 'boolean' } },
  onMemberClick: { action: 'onMemberClick()' },
};
