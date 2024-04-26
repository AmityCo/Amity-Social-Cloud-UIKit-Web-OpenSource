import React from 'react';

import UICommunityPermissions from './CommunityPermissions';
import { usePermission } from './utils';

interface CommunityPermissionsProps {
  communityId?: string;
}

const CommunityPermissions = ({ communityId }: CommunityPermissionsProps) => {
  const [needApprovalOnPostCreation, updateNeedApprovalOnPostCreation] = usePermission({
    communityId,
    key: 'needApprovalOnPostCreation',
  });

  return (
    <UICommunityPermissions
      needApprovalOnPostCreation={needApprovalOnPostCreation}
      onNeedApprovalOnPostCreationChange={updateNeedApprovalOnPostCreation}
    />
  );
};

export default CommunityPermissions;
