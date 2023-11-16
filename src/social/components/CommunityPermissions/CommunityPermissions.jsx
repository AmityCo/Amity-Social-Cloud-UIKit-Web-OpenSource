import React from 'react';
import { FormattedMessage } from 'react-intl';
import SwitchItem from './SwitchItem';
import {
  CommunityPermissionsBody,
  CommunityPermissionsContainer,
  CommunityPermissionsHeader,
} from './styles';

export default ({ needApprovalOnPostCreation, onNeedApprovalOnPostCreationChange }) => {
  return (
    <CommunityPermissionsContainer>
      <CommunityPermissionsHeader>
        <FormattedMessage id="community.permissions.postReview" />
      </CommunityPermissionsHeader>

      <CommunityPermissionsBody>
        <SwitchItem
          value={needApprovalOnPostCreation}
          onChange={onNeedApprovalOnPostCreationChange}
        />
      </CommunityPermissionsBody>
    </CommunityPermissionsContainer>
  );
};
