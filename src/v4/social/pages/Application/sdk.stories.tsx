import React from 'react';
import UiKitSocialApplication from '.';

export default {
  title: 'Social',
};

export const SDKCommunityAppV4 = {
  render: (props) => {
    return <UiKitSocialApplication {...props} />;
  },
  name: 'Social',

  args: {
    hideExplore: false,
    socialCommunityCreationButtonVisible: true,
  },
};
