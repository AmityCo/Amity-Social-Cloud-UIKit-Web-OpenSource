import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';
import Options from '../commonComponents/Options';
import { confirm } from '../commonComponents/Confirm';
import { notification } from '../commonComponents/Notification';
import { testMembers, testModerators } from '../mock';

import {
  Avatar,
  MemberInfo,
  MemberName,
  Caption,
  CommunityMembersContainer,
  CommunityMembersHeader,
  CommunityMemberContainer,
  CommunityMembersTabs,
} from './styles';

// TODO replace with translations keys
const tabs = {
  MEMBERS: 'Members',
  MODERATORS: 'Moderators',
};

const CommunityMember = ({ user, onMemberClick }) => {
  const confirmRemoving = () =>
    confirm({
      title: 'Remove user from community',
      content:
        'This user won’t no longer be able to search, post and interact in this community. Are you sure you want tocontinue?',
      okText: 'Remove',
      onOk: () => console.log('onRemove'),
    });

  const onReportClick = () =>
    notification.success({
      content: 'Report Sent',
    });

  return (
    <CommunityMemberContainer>
      <MemberInfo onClick={() => onMemberClick(user)}>
        <Avatar avatar={user.avatar} />
        <div>
          <MemberName>{user.name}</MemberName>
          <Caption>@useraccount</Caption>
        </div>
      </MemberInfo>
      <Options
        options={[
          { name: 'Remove from community', action: confirmRemoving },
          { name: 'Report user', action: onReportClick },
        ]}
      />
    </CommunityMemberContainer>
  );
};

const CommunityMembers = ({ communityId, onMemberClick }) => {
  const [activeTab, setActiveTab] = useState(tabs.MEMBERS);

  return (
    <CommunityMembersContainer>
      <CommunityMembersHeader>Community Members • 243</CommunityMembersHeader>
      <CommunityMembersTabs
        tabs={[tabs.MEMBERS, tabs.MODERATORS]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      {activeTab === tabs.MEMBERS &&
        testMembers.map(user => <CommunityMember user={user} onMemberClick={onMemberClick} />)}
      {activeTab === tabs.MODERATORS &&
        testModerators.map(user => <CommunityMember user={user} onMemberClick={onMemberClick} />)}
    </CommunityMembersContainer>
  );
};

export default customizableComponent('CommunityMembers')(CommunityMembers);
