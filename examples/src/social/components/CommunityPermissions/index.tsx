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

  const [storyCommentsApproval, updateStoryCommentsApproval] = usePermission({
    communityId,
    key: 'storyComments',
  });

  return (
    <UICommunityPermissions
      needApprovalOnPostCreation={needApprovalOnPostCreation}
      onNeedApprovalOnPostCreationChange={updateNeedApprovalOnPostCreation}
      storyCommentsApproval={storyCommentsApproval}
      onStoryCommentsApproval={updateStoryCommentsApproval}
    />
  );
};

export default CommunityPermissions;
