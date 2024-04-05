import React from 'react';
import { FormattedMessage } from 'react-intl';
import SwitchItem from './SwitchItem';
import {
  CommunityPermissionsBody,
  CommunityPermissionsContainer,
  CommunityPermissionsHeader,
  CommunityPermissionsItem,
  CommunityPermissionsWrapper,
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
    <CommunityPermissionsWrapper>
      <CommunityPermissionsContainer>
        <CommunityPermissionsItem>
          <CommunityPermissionsHeader>
            <FormattedMessage id="community.permissions.postReview" />
          </CommunityPermissionsHeader>
          <CommunityPermissionsBody>
            <SwitchItem
              title={<FormattedMessage id="community.permissions.approvePosts" />}
              promptText={<FormattedMessage id="community.permissions.approvePosts.prompt" />}
              value={needApprovalOnPostCreation}
              onChange={(newValue) => onNeedApprovalOnPostCreationChange?.(newValue)}
            />
          </CommunityPermissionsBody>
        </CommunityPermissionsItem>
      </CommunityPermissionsContainer>
    </CommunityPermissionsWrapper>
  );
}

export default (props: CommunityPermissionsProps) => {
  const CustomComponentFn = useCustomComponent<CommunityPermissionsProps>('CommunityPermissions');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <CommunityPermissions {...props} />;
};
