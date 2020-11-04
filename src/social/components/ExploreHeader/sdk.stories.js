import React from 'react';

import UiKitExploreHeader from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKExploreHeader = ({ ...props }) => <UiKitExploreHeader {...props} />;

SDKExploreHeader.storyName = 'Explore header';

SDKExploreHeader.argTypes = {
  onClickCommunity: { action: 'onClickCommunity()' },
  onCommunityCreated: { action: 'onCommunityCreated()' },
};
