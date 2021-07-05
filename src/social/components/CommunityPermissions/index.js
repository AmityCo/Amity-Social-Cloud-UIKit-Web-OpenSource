import React from 'react';
import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import UICommunityPermissions from './CommunityPermissions';
import { usePermission } from './utils';

function CommunityPermissions({ communityId }) {
  const [needApprovalOnPostCreation, updateNeedApprovalOnPostCreation] = usePermission(
    communityId,
    'needApprovalOnPostCreation',
  );

  return (
    <UICommunityPermissions
      needApprovalOnPostCreation={needApprovalOnPostCreation}
      onNeedApprovalOnPostCreationChange={updateNeedApprovalOnPostCreation}
    />
  );
}

export default withSDK(customizableComponent('CommunityPermissions', CommunityPermissions));
