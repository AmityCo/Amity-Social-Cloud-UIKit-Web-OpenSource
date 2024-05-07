import React from 'react';
import UiKitSocialApplication from '.';

export default {
  title: 'V4/Social',
};

export const SDKCommunityAppV4 = {
  render: (props) => {
    return <UiKitSocialApplication {...props} />;
  },
  name: 'Application',

  args: {
    shouldHideExplore: false,
    socialCommunityCreationButtonVisible: true,
  },

  argTypes: {
    shouldHideExplore: { control: { type: 'boolean' } },
    socialCommunityCreationButtonVisible: { control: { type: 'boolean' } },
    onMemberClick: { action: 'onMemberClick()' },
  },
};
