import React from 'react';
import { FormattedMessage } from 'react-intl';
import SwitchItem from './SwitchItem';
import {
  CommunityPermissionsBody,
  CommunityPermissionsContainer,
  CommunityPermissionsHeader,
} from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface CommunityPermissionsProps {
  needApprovalOnPostCreation: boolean;
  onNeedApprovalOnPostCreationChange?: (value: boolean) => void;
}

function CommunityPermissions({
  needApprovalOnPostCreation,
  onNeedApprovalOnPostCreationChange,
}: CommunityPermissionsProps) {
  return (
    <CommunityPermissionsContainer>
      <CommunityPermissionsHeader>
        <FormattedMessage id="community.permissions.postReview" />
      </CommunityPermissionsHeader>

      <CommunityPermissionsBody>
        <SwitchItem
          value={needApprovalOnPostCreation}
          onChange={(newValue) => onNeedApprovalOnPostCreationChange?.(newValue)}
        />
      </CommunityPermissionsBody>
    </CommunityPermissionsContainer>
  );
}

export default (props: CommunityPermissionsProps) => {
  const CustomComponentFn = useCustomComponent<CommunityPermissionsProps>('CommunityPermissions');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <CommunityPermissions {...props} />;
};
