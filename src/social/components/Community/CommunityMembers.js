import React, { useState } from 'react';
import { UserRepository } from 'eko-sdk';

import Options from '~/core/components/Options';
import { notification } from '~/core/components/Notification';
import { ConditionalRender } from '~/core/components/ConditionalRender';
import { LoadMore } from '~/social/components/LoadMore';
import { confirm } from '~/core/components/Confirm';
import { customizableComponent } from '~/core/hocs/customization';
import usePaginatedLiveObject from '~/core/hooks/useLiveCollection';

import {
  Avatar,
  MemberInfo,
  MemberName,
  CommunityMembersContainer,
  CommunityMembersHeader,
  CommunityMemberContainer,
  CommunityMembersTabs,
} from './styles';

// TODO replace with translations keys
// TODO: react-intl
const tabs = {
  MEMBERS: 'Members',
  MODERATORS: 'Moderators',
};

const CommunityMember = ({ user, onMemberClick }) => {
  const confirmRemoving = () =>
    confirm({
      // TODO: react-intl
      title: 'Remove user from community',
      content:
        'This user won’t no longer be able to search, post and interact in this community. Are you sure you want to continue?',
      okText: 'Remove',
      onOk: () => {},
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
          <MemberName>{user.displayName}</MemberName>
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

const CommunityMembers = ({ onMemberClick }) => {
  const [activeTab, setActiveTab] = useState(tabs.MEMBERS);

  const userRepo = new UserRepository();

  const [users, hasMoreUsers, loadMoreUsers] = usePaginatedLiveObject(
    () => userRepo.getAllUsers(),
    [],
  );

  const moderRepo = new UserRepository();
  const [moderators, hasMoreModerators, loadMoreModerators] = usePaginatedLiveObject(
    () => moderRepo.getAllUsers(),
    [],
  );

  return (
    <CommunityMembersContainer>
      <CommunityMembersHeader>Community Members • {users.length}</CommunityMembersHeader>
      <CommunityMembersTabs tabs={[tabs.MEMBERS]} activeTab={activeTab} onChange={setActiveTab} />
      <ConditionalRender condition={activeTab === tabs.MEMBERS}>
        <LoadMore hasMore={hasMoreUsers} loadMore={loadMoreUsers}>
          {users.map(user => (
            <CommunityMember key={user.userId} user={user} onMemberClick={onMemberClick} />
          ))}
        </LoadMore>
      </ConditionalRender>
      <ConditionalRender condition={activeTab === tabs.MODERATORS}>
        <LoadMore hasMore={hasMoreModerators} loadMore={loadMoreModerators}>
          {moderators.map(user => (
            <CommunityMember key={user.userId} user={user} onMemberClick={onMemberClick} />
          ))}
        </LoadMore>
      </ConditionalRender>
    </CommunityMembersContainer>
  );
};

export default customizableComponent('CommunityMembers', CommunityMembers);
