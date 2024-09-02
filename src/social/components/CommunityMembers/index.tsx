import React, { memo, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import useCommunity from '~/social/hooks/useCommunity';

import { useNavigation } from '~/social/providers/NavigationProvider';

import CommunityMemberItem from './CommunityMemberItem';

import { MemberTabs } from './constants';
import { CommunityMembersContainer, CommunityMembersHeader, CommunityMembersTabs } from './styles';
import useSDK from '~/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';
import { isAdmin, isModerator } from '~/helpers/permissions';
import { CommunityRepository, SubscriptionLevels } from '@amityco/ts-sdk';
import { isCommunityMember } from '~/helpers/utils';
import LoadMoreWrapper from '../LoadMoreWrapper';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useCommunitySubscription from '~/social/hooks/useCommunitySubscription';
import useCommunityModeratorsCollection from '~/social/hooks/collections/useCommunityModeratorsCollection';
import useCommunityMembersCollection from '~/social/hooks/collections/useCommunityMembersCollection';

const useMemberTab = ({
  community,
  members,
  loadMore: loadMoreMembers,
  hasMore: hasMoreMembers,
}: {
  community?: Amity.Community | null;
} & Pick<ReturnType<typeof useCommunityMembersCollection>, 'members' | 'loadMore' | 'hasMore'>) => {
  const communityId = community?.communityId;
  const { currentUserId } = useSDK();
  const currentMember = members.find((member) => member.userId === currentUserId);
  const user = useUser(currentUserId);

  const isCommunityModerator = isModerator(currentMember?.roles);
  const hasModeratorPermissions =
    (isCommunityMember(currentMember) && isCommunityModerator) ||
    isModerator(user?.roles) ||
    isAdmin(user?.roles);

  const assignRolesToUsers = (roles: string[], userIds: string[]) =>
    communityId && CommunityRepository.Moderation.addRoles(communityId, roles, userIds);

  const removeRolesFromUsers = (roles: string[], userIds: string[]) =>
    communityId && CommunityRepository.Moderation.removeRoles(communityId, roles, userIds);

  const removeMembers = (userIds: string[]) =>
    communityId && CommunityRepository.Membership.removeMembers(communityId, userIds);

  return {
    community,
    members,
    currentUserId,
    hasMoreMembers,
    loadMoreMembers,
    hasModeratorPermissions,
    assignRolesToUsers,
    removeRolesFromUsers,
    removeMembers,
  };
};

interface MemberTabProps {
  community?: Amity.Community | null;
}

const MemberTab = ({
  community,
  members,
  loadMore,
  hasMore,
}: MemberTabProps &
  Pick<ReturnType<typeof useCommunityMembersCollection>, 'members' | 'loadMore' | 'hasMore'>) => {
  const { onClickUser } = useNavigation();
  const {
    hasMoreMembers,
    loadMoreMembers,
    hasModeratorPermissions,
    currentUserId,
    assignRolesToUsers,
    removeRolesFromUsers,
    removeMembers,
  } = useMemberTab({
    community,
    hasMore,
    loadMore,
    members,
  });

  if (members.length === 0) return null;

  return (
    <LoadMoreWrapper
      hasMore={hasMoreMembers}
      loadMore={loadMoreMembers}
      contentSlot={members.map(({ userId, roles, isBanned }) => (
        <CommunityMemberItem
          key={userId}
          userId={userId}
          currentUserId={currentUserId || ''}
          roles={roles}
          assignRolesToUsers={assignRolesToUsers}
          removeRolesFromUsers={removeRolesFromUsers}
          removeMembers={removeMembers}
          hasModeratorPermissions={hasModeratorPermissions}
          isJoined={community?.isJoined}
          isBanned={isBanned}
          onClick={() => onClickUser(userId)}
        />
      ))}
    />
  );
};

const useModeratorTab = ({ community }: { community?: Amity.Community | null }) => {
  const communityId = community?.communityId;
  const { currentUserId } = useSDK();

  const { moderators, hasMore, loadMore } = useCommunityModeratorsCollection(communityId);
  const currentMember = moderators.find((moderator) => moderator.userId === currentUserId);
  const user = useUser(currentUserId);

  const isCommunityModerator = isModerator(currentMember?.roles);
  const hasModeratorPermissions =
    (isCommunityMember(currentMember) && isCommunityModerator) ||
    isModerator(user?.roles) ||
    isAdmin(user?.roles);

  const assignRolesToUsers = (roles: string[], userIds: string[]) =>
    communityId && CommunityRepository.Moderation.addRoles(communityId, roles, userIds);

  const removeRolesFromUsers = (roles: string[], userIds: string[]) =>
    communityId && CommunityRepository.Moderation.removeRoles(communityId, roles, userIds);

  const removeMembers = (userIds: string[]) =>
    communityId && CommunityRepository.Membership.removeMembers(communityId, userIds);

  return {
    moderators,
    currentUserId,
    hasMoreModerators: hasMore,
    loadMoreModerators: loadMore,
    hasModeratorPermissions,
    assignRolesToUsers,
    removeRolesFromUsers,
    removeMembers,
  };
};

interface ModeratorTabProps {
  community?: Amity.Community | null;
}

const ModeratorTab = ({ community }: ModeratorTabProps) => {
  const { onClickUser } = useNavigation();
  const {
    currentUserId,
    moderators,
    hasMoreModerators,
    loadMoreModerators,
    hasModeratorPermissions,
    assignRolesToUsers,
    removeRolesFromUsers,
    removeMembers,
  } = useModeratorTab({
    community,
  });

  if (moderators.length === 0) return null;

  return (
    <LoadMoreWrapper
      hasMore={hasMoreModerators}
      loadMore={loadMoreModerators}
      contentSlot={moderators.map(({ userId, roles, isBanned }) => (
        <CommunityMemberItem
          key={userId}
          userId={userId}
          currentUserId={currentUserId || ''}
          roles={roles}
          assignRolesToUsers={assignRolesToUsers}
          removeRolesFromUsers={removeRolesFromUsers}
          removeMembers={removeMembers}
          hasModeratorPermissions={hasModeratorPermissions}
          isJoined={community?.isJoined}
          isBanned={isBanned}
          onClick={(userId) => userId && onClickUser(userId)}
        />
      ))}
    />
  );
};

interface CommunityMembersProps {
  communityId?: string;
}

const CommunityMembers = ({ communityId }: CommunityMembersProps) => {
  const { formatMessage } = useIntl();

  const { hasMore, loadMore, loadMoreHasBeenCalled, isLoading, members } =
    useCommunityMembersCollection(communityId);

  const community = useCommunity(communityId);

  const tabs = [
    { value: 'MEMBERS', label: formatMessage({ id: 'CommunityMembers.members' }) },
    { value: 'MODERATORS', label: formatMessage({ id: 'CommunityMembers.moderators' }) },
  ];

  const [activeTab, setActiveTab] = useState(MemberTabs.MEMBERS);

  return (
    <CommunityMembersContainer>
      <CommunityMembersHeader>Community Members • {members.length || 0}</CommunityMembersHeader>
      <CommunityMembersTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === MemberTabs.MEMBERS && (
        <MemberTab community={community} hasMore={hasMore} loadMore={loadMore} members={members} />
      )}

      {activeTab === MemberTabs.MODERATORS && <ModeratorTab community={community} />}
    </CommunityMembersContainer>
  );
};

export default memo((props: CommunityMembersProps) => {
  const CustomComponentFn = useCustomComponent<CommunityMembersProps>('CommunityMembers');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <CommunityMembers {...props} />;
});
