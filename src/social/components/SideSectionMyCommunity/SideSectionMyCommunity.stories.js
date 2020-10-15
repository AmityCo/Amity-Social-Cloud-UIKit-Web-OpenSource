import React from 'react';

import SideSectionMyCommunity from '.';

export default {
  title: 'Components/Community/SideMenu/MyCommunitySection',
  parameters: { layout: 'centered' },
};

export const SDKSideSectionMyCommunity = ({
  onClickCreate,
  showCreateButton,
  onClickCommunity,
}) => {
  return (
    <SideSectionMyCommunity
      onClickCreate={onClickCreate}
      showCreateButton={showCreateButton}
      onClickCommunity={onClickCommunity}
    />
  );
};

SDKSideSectionMyCommunity.args = {
  showCreateButton: true,
};

SDKSideSectionMyCommunity.argTypes = {
  showCreateButton: { control: { type: 'boolean' } },
  onClickCreate: { action: 'Create community clicked' },
  onClickCommunity: { action: 'Community clicked' },
};
