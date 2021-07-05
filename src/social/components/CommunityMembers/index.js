import React, { memo, useState } from 'react';

import customizableComponent from '~/core/hocs/customization';

import useCommunityMembers from '~/social/hooks/useCommunityMembers';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';
import useCommunity from '~/social/hooks/useCommunity';

import ConditionalRender from '~/core/components/ConditionalRender';
import LoadMore from '~/social/components/LoadMore';
import { useNavigation } from '~/social/providers/NavigationProvider';

import CommunityMemberItem from './CommunityMemberItem';
import withSDK from '~/core/hocs/withSDK';

import { MemberTabs, tabs } from './constants';
import { CommunityMembersContainer, CommunityMembersHeader, CommunityMembersTabs } from './styles';

const CommunityMembers = ({ communityId, currentUserId }) => {
  const { onClickUser } = useNavigation();
  const [activeTab, setActiveTab] = useState(MemberTabs.MEMBERS);

  const {
    members = [],
    hasMoreMembers,
    loadMoreMembers,
    membersCount,
    assignRoleToUsers,
    removeRoleFromUsers,
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

  // to check if owner inside community list
  const isOwnerJoined = members.find(({ userId }) => userId === community.userId);

  // we show community owner separately
  const filteredModerators = moderators.filter(({ userId }) => userId !== community.userId);

  return (
    <CommunityMembersContainer>
      <CommunityMembersHeader>Community Members • {membersCount}</CommunityMembersHeader>
      <CommunityMembersTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <ConditionalRender condition={activeTab === MemberTabs.MEMBERS}>
        <LoadMore hasMore={hasMoreMembers} loadMore={loadMoreMembers}>
          {members.length > 0 &&
            members.map(({ userId, roles }) => (
              <CommunityMemberItem
                key={userId}
                userId={userId}
                currentUserId={currentUserId}
                roles={roles}
                onClick={onClickUser}
                assignRoleToUsers={assignRoleToUsers}
                removeRoleFromUsers={removeRoleFromUsers}
                removeMembers={removeMembers}
                hasModeratorPermissions={hasModeratorPermissions}
                isJoined={community.isJoined}
                communityUserId={community.userId}
              />
            ))}
        </LoadMore>
      </ConditionalRender>
      <ConditionalRender condition={activeTab === MemberTabs.MODERATORS}>
        <>
          {isOwnerJoined && (
            <CommunityMemberItem
              userId={community.userId}
              currentUserId={currentUserId}
              onClick={onClickUser}
              assignRoleToUsers={assignRoleToUsers}
              removeRoleFromUsers={removeRoleFromUsers}
              removeMembers={removeMembers}
              hasModeratorPermissions={hasModeratorPermissions}
              isJoined={community.isJoined}
              communityUserId={community.userId}
            />
          )}
          <LoadMore hasMore={hasMoreModerators} loadMore={loadMoreModerators}>
            {filteredModerators.length > 0 &&
              filteredModerators.map(({ userId, roles }) => (
                <CommunityMemberItem
                  key={userId}
                  userId={userId}
                  currentUserId={currentUserId}
                  roles={roles}
                  onClick={onClickUser}
                  assignRoleToUsers={assignRoleToUsers}
                  removeRoleFromUsers={removeRoleFromUsers}
                  removeMembers={removeMembers}
                  hasModeratorPermissions={hasModeratorPermissions}
                  communityUserId={community.userId}
                  isJoined={community.isJoined}
                />
              ))}
          </LoadMore>
        </>
      </ConditionalRender>
    </CommunityMembersContainer>
  );
};

export default memo(withSDK(customizableComponent('CommunityMembers', CommunityMembers)));
