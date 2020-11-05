import React from 'react';

import UiKitSideSectionMyCommunity from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKSideSectionMyCommunity = ({ onClickCommunity, onCommunityCreated }) => {
  return (
    <UiKitSideSectionMyCommunity
      onClickCommunity={onClickCommunity}
      onCommunityCreated={onCommunityCreated}
    />
  );
};

SDKSideSectionMyCommunity.storyName = 'My community side section';

SDKSideSectionMyCommunity.argTypes = {
  onClickCommunity: { action: 'ConClickCommunity()' },
  onCommunityCreated: { action: 'onCommunityCreated(communityId)' },
};
