import React, { useState } from 'react';

import customizableComponent from '~/core/hocs/customization';

import useCommunityMembers from '~/social/hooks/useCommunityMembers';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';
import useCommunity from '~/social/hooks/useCommunity';

import ConditionalRender from '~/core/components/ConditionalRender';
import LoadMore from '~/social/components/LoadMore';
import { useNavigation } from '~/social/providers/NavigationProvider';

import CommunityMemberItem from './CommunityMemberItem';
import withSDK from '~/core/hocs/withSDK';

import { CommunityMembersContainer, CommunityMembersHeader, CommunityMembersTabs } from './styles';

// TODO replace with translations keys
// TODO: react-intl
const tabs = {
  MEMBERS: 'Members',
  MODERATORS: 'Moderators',
};

const CommunityMembers = ({ communityId, currentUserId }) => {
  const { onClickUser } = useNavigation();
  const [activeTab, setActiveTab] = useState(tabs.MEMBERS);

  const {
    members,
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

  return (
    <CommunityMembersContainer>
      <CommunityMembersHeader>Community Members • {membersCount}</CommunityMembersHeader>
      <CommunityMembersTabs
        tabs={[tabs.MEMBERS, tabs.MODERATORS]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      <ConditionalRender condition={activeTab === tabs.MEMBERS}>
        <LoadMore hasMore={hasMoreMembers} loadMore={loadMoreMembers}>
          {members.length > 0 &&
            members.map(({ userId, roles }) => (
              <CommunityMemberItem
                key={userId}
                userId={userId}
                roles={roles}
                onClick={onClickUser}
                assignRoleToUsers={assignRoleToUsers}
                removeRoleFromUsers={removeRoleFromUsers}
                removeMembers={removeMembers}
                hasModeratorPermissions={hasModeratorPermissions}
              />
            ))}
        </LoadMore>
      </ConditionalRender>
      <ConditionalRender condition={activeTab === tabs.MODERATORS}>
        <LoadMore hasMore={hasMoreModerators} loadMore={loadMoreModerators}>
          {moderators.length > 0 &&
            moderators.map(({ userId, roles }) => (
              <CommunityMemberItem
                key={userId}
                userId={userId}
                roles={roles}
                onClick={onClickUser}
                assignRoleToUsers={assignRoleToUsers}
                removeRoleFromUsers={removeRoleFromUsers}
                removeMembers={removeMembers}
                hasModeratorPermissions={hasModeratorPermissions}
              />
            ))}
        </LoadMore>
      </ConditionalRender>
    </CommunityMembersContainer>
  );
};

export default withSDK(customizableComponent('CommunityMembers', CommunityMembers));
