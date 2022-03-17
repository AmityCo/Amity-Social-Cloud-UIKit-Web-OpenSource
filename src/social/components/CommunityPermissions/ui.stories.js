import React from 'react';
import CommunityPermissions from './CommunityPermissions';

export default {
  title: 'Ui Only/Social/Community',
};

export const UiCommunityPermissions = (args) => {
  return <CommunityPermissions {...args} />;
};

UiCommunityPermissions.storyName = 'CommunityPermissions';

UiCommunityPermissions.args = {
  needApprovalOnPostCreation: false,
};

UiCommunityPermissions.argTypes = {
  onNeedApprovalOnPostCreationChange: { action: 'onNeedApprovalOnPostCreationChange()' },
};
