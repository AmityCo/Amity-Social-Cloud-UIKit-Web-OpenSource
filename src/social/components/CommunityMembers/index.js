import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';

import customizableComponent from '~/core/hocs/customization';

import useCommunityMembers from '~/social/hooks/useCommunityMembers';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';
import useCommunity from '~/social/hooks/useCommunity';

import LoadMore from '~/social/components/LoadMore';
import { useNavigation } from '~/social/providers/NavigationProvider';

import CommunityMemberItem from './CommunityMemberItem';
import withSDK from '~/core/hocs/withSDK';

import { MemberTabs } from './constants';
import { CommunityMembersContainer, CommunityMembersHeader, CommunityMembersTabs } from './styles';

const CommunityMembers = ({ communityId, currentUserId }) => {
  const { formatMessage } = useIntl();

  const tabs = [
    { value: 'MEMBERS', label: formatMessage({ id: 'CommunityMembers.members' }) },
    { value: 'MODERATORS', label: formatMessage({ id: 'CommunityMembers.moderators' }) },
  ];

  const { onClickUser } = useNavigation();
  const [activeTab, setActiveTab] = useState(MemberTabs.MEMBERS);

  const {
    members = [],
    hasMoreMembers,
    loadMoreMembers,
    membersCount,
    assignRolesToUsers,
    removeRolesFromUsers,
    moderators,
    hasMoreModerators,
    loadMoreModerators,
    removeMembers,
  } = useCommunityMembers(communityId);

  const { community } = useCommunity(communityId);
  const { hasModeratorPermissions } = useCommunityOneMember(
    communityId,
    currentUserId,
    community.userId,
  );

  return (
    <CommunityMembersContainer>
      <CommunityMembersHeader>Community Members • {membersCount}</CommunityMembersHeader>
      <CommunityMembersTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === MemberTabs.MEMBERS && (
        <LoadMore hasMore={hasMoreMembers} loadMore={loadMoreMembers}>
          {members.length > 0 &&
            members.map(({ userId, roles, isBanned }) => (
              <CommunityMemberItem
                key={userId}
                userId={userId}
                currentUserId={currentUserId}
                roles={roles}
                assignRolesToUsers={assignRolesToUsers}
                removeRolesFromUsers={removeRolesFromUsers}
                removeMembers={removeMembers}
                hasModeratorPermissions={hasModeratorPermissions}
                isJoined={community.isJoined}
                isBanned={isBanned}
                onClick={onClickUser}
              />
            ))}
        </LoadMore>
      )}

      {activeTab === MemberTabs.MODERATORS && (
        <LoadMore hasMore={hasMoreModerators} loadMore={loadMoreModerators}>
          {moderators.length > 0 &&
            moderators.map(({ userId, roles, isBanned }) => (
              <CommunityMemberItem
                key={userId}
                userId={userId}
                currentUserId={currentUserId}
                roles={roles}
                assignRolesToUsers={assignRolesToUsers}
                removeRolesFromUsers={removeRolesFromUsers}
                removeMembers={removeMembers}
                hasModeratorPermissions={hasModeratorPermissions}
                isJoined={community.isJoined}
                isBanned={isBanned}
                onClick={onClickUser}
              />
            ))}
        </LoadMore>
      )}
    </CommunityMembersContainer>
  );
};

export default memo(withSDK(customizableComponent('CommunityMembers', CommunityMembers)));
