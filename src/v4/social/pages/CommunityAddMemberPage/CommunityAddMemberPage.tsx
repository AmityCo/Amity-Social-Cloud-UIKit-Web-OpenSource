import React, { useState } from 'react';
import { useCommunitySetupContext } from '~/v4/social/providers/CommunitySetupProvider';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CloseButton } from '~/v4/social/elements/CloseButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Typography } from '~/v4/core/components';
import { Search } from '~/v4/icons/Search';
import { Input } from 'react-aria-components';
import { Button } from '~/v4/core/natives/Button';
import { Clear } from '~/v4/icons/Clear';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { CheckboxGroup } from '~/v4/core/components/AriaCheckboxGroup';
import useAllUsersCollection from '~/v4/core/hooks/collections/useAllUsersCollection';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import { SearchResultSkeleton } from '~/v4/social/internal-components/SearchResultSkeleton/SearchResultSkeleton';
import { MemberCommunitySetup } from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Button as AriaButton } from '~/v4/core/components/AriaButton';
import styles from './CommunityAddMemberPage.module.css';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useNetworkState } from 'react-use';
interface CommunityAddMemberPageProps {
  member?: MemberCommunitySetup[];
  communityId?: string;
  closePopup?: () => void;
  onAddedAction?: (userId: string[]) => void;
}

export const CommunityAddMemberPage = ({
  member,
  closePopup,
  communityId,
  onAddedAction,
}: CommunityAddMemberPageProps) => {
  const pageId = 'community_add_member_page';
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });
  const { members, setMembers } = useCommunitySetupContext();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<MemberCommunitySetup[]>(members ?? []);
  const { onBack } = useNavigation();
  const { isDesktop } = useResponsive();
  const notification = useNotifications();
  const { online } = useNetworkState();

  const { users, hasMore, loadMore, isLoading } = useAllUsersCollection({
    queryParams: {
      limit: 20,
    },
    shouldCall: memberSearch.length === 0,
  });
  const {
    users: userSearchResults,
    hasMore: hasMoreSearch,
    loadMore: loadMoreSearch,
    isLoading: isSearchLoading,
  } = useUserQueryByDisplayName({
    displayName: memberSearch,
    limit: 10,
    enabled: memberSearch.length > 0,
  });

  const { members: communityMember } = useCommunityMembersCollection({
    queryParams: { communityId: communityId as string, memberships: ['member'] },
    shouldCall: !!communityId,
  });

  const communityMemberIds = communityMember.map((member) => member.userId);
  const nonMemberUsers = users.filter((user) => !communityMemberIds.includes(user.userId));
  const nonMemberSearchUsers = userSearchResults.filter(
    (user) => !communityMemberIds.includes(user.userId),
  );

  useIntersectionObserver({
    onIntersect: () => {
      if (memberSearch.length === 0 && hasMore && isLoading === false) {
        loadMore();
      }
      if (memberSearch.length > 0 && hasMoreSearch && isSearchLoading === false) {
        loadMoreSearch();
      }
    },
    node: intersectionNode,
  });

  const handleRemoveUser = (userId: string) => {
    if (selectedMembers.length === 1) return setSelectedMembers([]);
    setSelectedMembers(selectedMembers.filter((user) => user.userId !== userId));
  };

  const handleSubmitAddMember = () => {
    const userIds = selectedMembers.map((member) => member.userId);
    onAddedAction && onAddedAction(userIds);
  };

  const handleAddMember = () => {
    if (!online) {
      notification.info({
        content: 'Failed to add member. Please try again.',
        alignment: 'fixed',
      });
      return;
    }
    onAddedAction ? handleSubmitAddMember() : setMembers(selectedMembers);
    isDesktop ? closePopup?.() : onBack();
  };

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberSearch(e.target.value);
  };

  const renderLoading = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <SearchResultSkeleton key={index} pageId={pageId} />
    ));
  };

  const renderSelectedMembers = () => {
    return selectedMembers.length > 0 ? (
      <div className={styles.communityAddMemberPage__selectedUsersWrap}>
        {selectedMembers.map((user) => (
          <div key={user.userId} className={styles.communityAddMemberPage__selectedUser}>
            <div className={styles.communityAddMemberPage__selectedUserAvatar}>
              <UserAvatar
                userId={user.userId}
                className={styles.communityAddMemberPage__memberAvatar}
              />
              <Button
                aria-label="close"
                className={styles.communityAddMemberPage__removeUserButton}
                onPress={() => handleRemoveUser(user.userId)}
              >
                <Clear className={styles.communityAddMemberPage__removeUser} />
              </Button>
            </div>

            <Typography.Body
              key={user.userId}
              className={styles.communityAddMemberPage__selectedUserDisplayName}
            >
              {user.displayName}
            </Typography.Body>
          </div>
        ))}
      </div>
    ) : null;
  };

  const filteredUsers = communityId
    ? memberSearch.length > 0
      ? nonMemberSearchUsers
      : nonMemberUsers
    : memberSearch.length > 0
      ? userSearchResults
      : users;

  return (
    <div
      data-testid={accessibilityId}
      style={themeStyles}
      className={styles.communityAddMemberPage__container}
    >
      <div className={styles.communityAddMemberPage__topbarSticky}>
        <div className={styles.communityAddMemberPage__navbar}>
          <CloseButton
            pageId={pageId}
            onPress={() => (isDesktop ? closePopup?.() : onBack())}
            defaultClassName={styles.communityAddMemberPage__closeButton}
          />
          <Typography.TitleBold className={styles.communityAddMemberPage__title}>
            Add member
          </Typography.TitleBold>
          <div className={styles.communityAddMemberPage__emptySapce} />
        </div>
        <div className={styles.communityAddMemberPage__searchWrap}>
          <Search
            data-search-value={memberSearch.length > 0}
            className={styles.communityAddMemberPage__searchIcon}
          />
          <Input
            className={styles.communityAddMemberPage__searchInput}
            type="text"
            placeholder="Search user"
            value={memberSearch}
            onChange={(e) => handleSearchUser(e)}
          />
          <Button
            aria-label="Close"
            data-search-value={memberSearch.length > 0}
            onPress={() => setMemberSearch('')}
            className={styles.communityAddMemberPage__clearSearchButton}
          >
            <Clear className={styles.communityAddMemberPage__clearSearch} />
          </Button>
        </div>
        {renderSelectedMembers()}
      </div>
      <div
        className={styles.communityAddMemberPage__memberList}
        data-has-selected={selectedMembers.length > 0}
      >
        <CheckboxGroup
          aria-label="add-member-checkbox"
          value={selectedMembers.map((member) => member.userId)}
          checkboxProps={{ className: styles.checkbox__item }}
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
                .map((user) => ({ userId: user.userId, displayName: user.displayName ?? '' }));

              return [...oldSelectedMembers, ...newSelectedMembers];
            });
          }}
          checkboxes={filteredUsers.map((user) => ({
            value: user.userId,
            label: (
              <div className={styles.communityAddMemberPage__checkboxLabel}>
                <div className={styles.communityAddMemberPage__memberAvatar}>
                  <UserAvatar
                    userId={user.userId}
                    className={styles.communityAddMemberPage__selectedUserAvatarImage}
                    textPlaceholderClassName={
                      styles.communityAddMemberPage__selectedUserAvatarImage
                    }
                  />
                </div>
                <Typography.BodyBold className={styles.communityAddMemberPage__memberName}>
                  {user.displayName}
                </Typography.BodyBold>
              </div>
            ),
          }))}
        />
        {isLoading || isSearchLoading ? renderLoading() : null}
        <div ref={(node) => setIntersectionNode(node)} />
      </div>
      <div className={styles.communityAddMemberPage__addMemberButton}>
        <AriaButton
          size="medium"
          type="button"
          variant="fill"
          color="primary"
          onPress={handleAddMember}
          isDisabled={selectedMembers.length === 0}
          data-testid={`${pageId}/*/add_member_button`}
          className={styles.communityAddMemberPage__button}
        >
          Add member
        </AriaButton>
      </div>
    </div>
  );
};
