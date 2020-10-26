import React from 'react';

import UiKitSideSectionMyCommunity from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKSideSectionMyCommunity = ({
  onClickCreate,
  showCreateButton,
  onClickCommunity,
}) => {
  return (
    <UiKitSideSectionMyCommunity
      onClickCreate={onClickCreate}
      showCreateButton={showCreateButton}
      onClickCommunity={onClickCommunity}
    />
  );
};

SDKSideSectionMyCommunity.storyName = 'My community side section';

SDKSideSectionMyCommunity.args = {
  showCreateButton: true,
};

SDKSideSectionMyCommunity.argTypes = {
  showCreateButton: { control: { type: 'boolean' } },
  onClickCreate: { action: 'onClickCreate()' },
  onClickCommunity: { action: 'ConClickCommunity()' },
};
