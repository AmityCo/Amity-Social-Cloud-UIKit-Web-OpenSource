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
  storyCommentsApproval: boolean;
  onNeedApprovalOnPostCreationChange?: (value: boolean) => void;
  onStoryCommentsApproval?: (value: boolean) => void;
}

function CommunityPermissions({
  needApprovalOnPostCreation,
  storyCommentsApproval,
  onNeedApprovalOnPostCreationChange,
  onStoryCommentsApproval,
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

      <CommunityPermissionsContainer>
        <CommunityPermissionsItem>
          <CommunityPermissionsHeader>
            <FormattedMessage id="community.permissions.storyComments" />
          </CommunityPermissionsHeader>
          <CommunityPermissionsBody>
            <SwitchItem
              title={<FormattedMessage id="community.permissions.allowStoryComments" />}
              promptText={<FormattedMessage id="community.permissions.storyComments.prompt" />}
              value={storyCommentsApproval}
              onChange={(newValue) => onStoryCommentsApproval?.(newValue)}
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
