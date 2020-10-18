import React from 'react';
import CommunityV2 from '.';

export default {
  title: 'CommunityV2',
  parameters: { layout: 'centered' },
};

export const CommunityV2Story = args => {
  return <CommunityV2 {...args} />;
};

CommunityV2Story.args = {
  shouldHideExplore: false,
  shouldHideTabs: false,
  showCreateCommunityButton: true,
};

CommunityV2Story.argTypes = {
  shouldHideExplore: { control: { type: 'boolean' } },
  shouldHideTabs: { control: { type: 'boolean' } },
  showCreateCommunityButton: { control: { type: 'boolean' } },
  onMemberClick: { action: 'Member clicked' },
};
