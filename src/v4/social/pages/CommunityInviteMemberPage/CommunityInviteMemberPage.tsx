import React, { useEffect, useState } from 'react';
import { useString, resolveString } from '~/v4/core/localization';
import { useCommunitySetupContext } from '~/v4/social/providers/CommunitySetupProvider';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CloseButton } from '~/v4/social/elements/CloseButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { Clear } from '~/v4/icons/Clear';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { CheckboxGroup } from '~/v4/core/components/AriaCheckboxGroup';
import useAllUsersCollection from '~/v4/core/hooks/collections/useAllUsersCollection';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import { SearchResultSkeleton } from '~/v4/social/internal-components/SearchResultSkeleton/SearchResultSkeleton';
import { MemberCommunitySetup } from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useNetworkState } from 'react-use';
import { TopSearchBar } from '~/v4/social/components';
import styles from './CommunityInviteMemberPage.module.css';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { BrandBadge, InviteButton, Title } from '~/v4/social/elements';
import { NoResult } from '~/v4/social/internal-components/NoResult';
import { EmptyResult } from '~/v4/social/internal-components/EmptyResult';
import { NoInternet } from '~/v4/social/internal-components/NoInternet';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { LimitCharacterSearch } from '~/v4/social/internal-components/LimitCharacterSearch/LimitCharacterSearch';
import { useKeyboardVisibility } from './useKeyboardVisibility';

type CommunityInviteMemberPageProps = {
  communityId?: string;
  users?: Amity.User[];
  onSubmit?: (userId: string[]) => void;
};

function useCommunityInviteMemberPage({
  onSubmit,
  communityId,
  users: $users,
}: CommunityInviteMemberPageProps) {
  const pageId = 'community_invite_member_page';

  const { onBack } = useNavigation();

  const { online } = useNetworkState();
  const { isDesktop } = useResponsive();
  const notification = useNotifications();
  const { closePopup } = usePopupContext();
  const { members, setMembers } = useCommunitySetupContext();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const { keyboardOffset } = useKeyboardVisibility();

  const [search, setSearch] = useState('');
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<MemberCommunitySetup[]>(
    $users && $users.length > 0
      ? $users.map(
          (user) =>
            ({
              userId: user._id,
              displayName: user.displayName,
              isBrand: user.isBrand,
            }) as MemberCommunitySetup,
        )
      : members ?? [],
  );

  const { users, hasMore, loadMore, isLoading } = useAllUsersCollection({
    queryParams: { limit: 20 },
    shouldCall: search.length === 0,
  });

  const {
    users: searchedUsers,
    hasMore: hasMoreSearch,
    loadMore: loadMoreSearch,
    isLoading: isSearchLoading,
  } = useUserQueryByDisplayName({
    limit: 10,
    displayName: search,
    enabled: search.length > 0,
  });

  const { members: communityMembers } = useCommunityMembersCollection({
    queryParams: { communityId: communityId as string, memberships: ['member'] },
    shouldCall: !!communityId,
  });

  const communityMemberIds = communityMembers.map((member) => member.userId);

  const nonMemberUsers = users.filter((user) => !communityMemberIds.includes(user.userId));

  const nonMemberSearchedUsers = searchedUsers.filter(
    (user) => !communityMemberIds.includes(user.userId),
  );

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (search.length === 0 && hasMore && isLoading === false) {
        loadMore();
      }
      if (search.length > 0 && hasMoreSearch && isSearchLoading === false) {
        loadMoreSearch();
      }
    },
  });

  useEffect(() => {
    !online &&
      notification.info({
        alignment: 'fixed',
        content: resolveString('amity_social_label_no_internet_connection'),
        duration: 1000 * 60,
      });
  }, [online]);

  const handleRemoveUser = (userId: string) => {
    setSelectedMembers(selectedMembers.filter((user) => user.userId !== userId));
  };

  const handleClose = () => (isDesktop ? closePopup?.(pageId) : onBack());

  const handleInviteMember = () => {
    if (!online) {
      return notification.info({
        alignment: 'fixed',
        content: useString('amity_social_toast_community_invitation_create_failed'),
      });
    }
    onSubmit
      ? onSubmit(selectedMembers.map((member) => member.userId))
      : setMembers(selectedMembers);
    handleClose();
  };

  const filteredUsers = communityId
    ? search.length > 0
      ? nonMemberSearchedUsers
      : nonMemberUsers
    : search.length > 0
      ? searchedUsers
      : users;

  const isNoResult =
    online && search.length > 2 && filteredUsers.length === 0 && !isLoading && !isSearchLoading;

  const isEmpty =
    online && search.length === 0 && filteredUsers.length === 0 && !isLoading && !isSearchLoading;

  const isLimitCharacterSearch =
    online && search.length > 0 && search.length < 3 && !isLoading && !isSearchLoading;

  const isFetching = (isLoading || isSearchLoading) && online;

  return {
    pageId,
    themeStyles,
    filteredUsers,
    accessibilityId,
    intersectionNode,
    setIntersectionNode,
    search,
    setSearch,
    handleClose,
    handleInviteMember,
    selectedMembers,
    handleRemoveUser,
    setSelectedMembers,
    isLoading,
    isSearchLoading,
    online,
    isNoResult,
    isEmpty,
    isOnline: online,
    isFetching,
    isLimitCharacterSearch,
    keyboardOffset,
  };
}

export const CommunityInviteMemberPage = (props: CommunityInviteMemberPageProps) => {
  const {
    pageId,
    themeStyles,
    accessibilityId,
    handleClose,
    selectedMembers,
    filteredUsers,
    handleInviteMember,
    handleRemoveUser,
    setIntersectionNode,
    setSearch,
    setSelectedMembers,
    isOnline,
    isEmpty,
    isNoResult,
    isFetching,
    isLimitCharacterSearch,
    keyboardOffset,
  } = useCommunityInviteMemberPage(props);

  return (
    <section
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.communityInviteMemberPage}
    >
      <CommunityInviteMemberPageTopBar
        pageId={pageId}
        handleClose={handleClose}
        selectedMembers={selectedMembers}
        handleRemoveUser={handleRemoveUser}
        search={(search: string) => setSearch(search)}
      />
      <div
        data-has-selected={selectedMembers.length > 0}
        className={styles.communityInviteMemberPage__memberList}
      >
        {!isOnline && filteredUsers.length === 0 && (
          <div
            data-selected={selectedMembers.length > 0}
            className={styles.communityInviteMemberPage__state}
          >
            <NoInternet pageId={pageId} />
          </div>
        )}
        {isNoResult && (
          <div
            data-selected={selectedMembers.length > 0}
            className={styles.communityInviteMemberPage__state}
          >
            <NoResult pageId={pageId} />
          </div>
        )}
        {isLimitCharacterSearch && (
          <div
            data-selected={selectedMembers.length > 0}
            className={styles.communityInviteMemberPage__state}
          >
            <LimitCharacterSearch pageId={pageId} style={{ marginBottom: keyboardOffset }} />
          </div>
        )}
        {isEmpty && (
          <div
            data-selected={selectedMembers.length > 0}
            className={styles.communityInviteMemberPage__state}
          >
            <EmptyResult pageId={pageId} textId="amity_social_label_no_users_available" />
          </div>
        )}
        {filteredUsers.length > 0 && (
          <CheckboxGroup
            alignment="row-reverse"
            aria-label="invite-member-checkbox"
            value={selectedMembers.map((member) => member.userId)}
            className={styles.communityInviteMemberPage__checkboxGroup}
            checkboxes={filteredUsers.map((user) => ({
              value: user.userId,
              label: <MemberLabel pageId={pageId} user={user} />,
            }))}
            onChange={(value) => {
              setSelectedMembers((existingSelectedMembers) => {
                if (value.length < existingSelectedMembers.length) {
                  return existingSelectedMembers.filter((user) => value.includes(user.userId));
                }

                const oldSelectedMembers = existingSelectedMembers.filter((user) =>
                  value.includes(user.userId),
                );
                const newSelectedMemberValue = value.slice(
                  -(value.length - oldSelectedMembers.length),
                );
                const newSelectedMembers = filteredUsers
                  .filter((user) => newSelectedMemberValue.includes(user.userId))
                  .map((user) => ({
                    userId: user.userId,
                    displayName: user.displayName ?? '',
                    isBrand: user.isBrand,
                  }));

                return [...oldSelectedMembers, ...newSelectedMembers];
              });
            }}
          />
        )}
        {isFetching &&
          Array.from({ length: 3 }).map((_, index) => (
            <SearchResultSkeleton key={index} pageId={pageId} />
          ))}
        <div ref={(node) => setIntersectionNode(node)} />
      </div>
      <div
        className={styles.communityInviteMemberPage__inviteMember}
        style={{ marginBottom: keyboardOffset }}
      >
        <InviteButton
          pageId={pageId}
          onPress={handleInviteMember}
          isDisabled={selectedMembers.length === 0 || !isOnline}
        />
      </div>
    </section>
  );
};

type CommunityInviteMemberPageTopBarProps = {
  pageId: string;
  handleClose: () => void;
  search: (search: string) => void;
  selectedMembers: MemberCommunitySetup[];
  handleRemoveUser: (userId: string) => void;
};

function CommunityInviteMemberPageTopBar({
  pageId,
  search,
  handleClose,
  selectedMembers,
  handleRemoveUser,
}: CommunityInviteMemberPageTopBarProps) {
  return (
    <div className={styles.communityInviteMemberPage__topBarSticky}>
      <nav className={styles.communityInviteMemberPage__navbar}>
        <CloseButton
          pageId={pageId}
          aria-label="Click to close dialog"
          onPress={handleClose}
          defaultClassName={styles.communityInviteMemberPage__closeButton}
        />
        <Title
          pageId={pageId}
          textKey="amity_social_button_invite_member"
          titleClassName={styles.communityInviteMemberPage__title}
        />
        <div className={styles.communityInviteMemberPage__emptySpace} />
      </nav>
      <div className={styles.communityInviteMemberPage__search}>
        <TopSearchBar pageId={pageId} hasCancelButton={false} search={search} />
      </div>
      {selectedMembers.length > 0 && (
        <div className={styles.communityInviteMemberPage__selectedUsers}>
          {selectedMembers.map((user) => (
            <SelectedMember
              user={user}
              key={user.userId}
              handleRemoveUser={() => handleRemoveUser(user.userId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type SelectedMemberProps = {
  pageId?: string;
  user: MemberCommunitySetup;
  handleRemoveUser: () => void;
};

function SelectedMember({ pageId = '*', user, handleRemoveUser }: SelectedMemberProps) {
  return (
    <div key={user.userId} className={styles.communityInviteMemberPage__selectedUser}>
      <div className={styles.communityInviteMemberPage__selectedUserAvatar}>
        <UserAvatar
          userId={user.userId}
          className={styles.communityInviteMemberPage__selectedUserAvatarImage}
          imageContainerClassName={styles.communityInviteMemberPage__selectedUserAvatarImage}
          textPlaceholderClassName={styles.communityInviteMemberPage__selectedUserAvatarImage}
        />
        <Button
          aria-label="click to remove user"
          onPress={handleRemoveUser}
          className={styles.communityInviteMemberPage__removeUserButton}
        >
          <Clear className={styles.communityInviteMemberPage__removeUserIcon} />
        </Button>
      </div>
      <Typography.Body
        data-is-brand={user.isBrand}
        key={user.userId}
        className={styles.communityInviteMemberPage__selectedUserDisplayName}
      >
        {user.displayName}
      </Typography.Body>
      {user.isBrand && <BrandBadge pageId={pageId} />}
    </div>
  );
}

type MemberLabelProps = {
  pageId?: string;
  user: Amity.User;
};

function MemberLabel({ pageId = '*', user }: MemberLabelProps) {
  const { isDesktop } = useResponsive();
  const { AmityCommunityInviteMemberPageBehavior } = usePageBehavior();

  return (
    <div
      data-testid={`${pageId}/*/member-label-${user.userId}`}
      className={styles.communityInviteMemberPage__checkboxLabel}
    >
      <div className={styles.communityInviteMemberPage__memberAvatar}>
        <UserAvatar
          userId={user.userId}
          className={styles.communityInviteMemberPage__selectedUserAvatarImage}
          textPlaceholderClassName={styles.communityInviteMemberPage__selectedUserAvatarImage}
          onPressAvatar={() =>
            !isDesktop &&
            AmityCommunityInviteMemberPageBehavior?.goToUserProfilePage?.({ userId: user.userId })
          }
        />
      </div>
      <Typography.BodyBold
        testId={`${pageId}/*/member-${user.userId}`}
        className={styles.communityInviteMemberPage__memberName}
      >
        {user.displayName ?? user.userId}
      </Typography.BodyBold>
      <div className={styles.communityInviteMemberPage__selectedUserBrandBadge}>
        {user.isBrand && <BrandBadge pageId={pageId} />}
      </div>
    </div>
  );
}
