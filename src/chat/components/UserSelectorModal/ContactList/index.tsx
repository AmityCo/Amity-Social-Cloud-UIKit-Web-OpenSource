import React, { Fragment, useRef } from 'react';
import { useIntl } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';

import SolarSystemIcon from '~/icons/SolarSystem';
import EmptyState from '~/core/components/EmptyState';

import UserItem from '../UserItem';
import {
  ListItemContainer,
  EmptyStateIcon,
  WrapEmptyState,
  InfiniteScrollContainer,
} from './styles';
import useSDK from '~/core/hooks/useSDK';
import useAllUsersCollection from '~/core/hooks/collections/useAllUsersCollection';
import useUsersCollection from '~/core/hooks/collections/useUsersCollection';

interface UserListProps {
  users: Amity.User[];
  hasMore: boolean;
  loadMore: () => void;
  selectedUserIds: string[];
  onUserItemSelected: (userData: Amity.User) => void;
  excludeSelf?: boolean;
}
// this component will exclude current user
const UserList = ({
  users,
  hasMore,
  loadMore,
  selectedUserIds,
  onUserItemSelected,
  excludeSelf,
}: UserListProps) => {
  const { formatMessage } = useIntl();
  const { currentUserId } = useSDK();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filterUsers = excludeSelf ? users.filter(({ userId }) => userId !== currentUserId) : users;

  return (
    <>
      {!filterUsers && (
        <WrapEmptyState>
          <EmptyState
            icon={
              <EmptyStateIcon>
                <SolarSystemIcon />
              </EmptyStateIcon>
            }
            title={formatMessage({ id: 'userSelector.emptyState.title' })}
            description={formatMessage({ id: 'userSelector.emptyState.description' })}
          />
        </WrapEmptyState>
      )}

      <InfiniteScrollContainer ref={containerRef}>
        {filterUsers && containerRef.current ? (
          <InfiniteScroll
            hasMore={hasMore}
            next={loadMore}
            loader={<span key={0}>Loading...</span>}
            dataLength={filterUsers?.length || 0}
          >
            <ListItemContainer>
              {filterUsers.map((userData) => (
                <UserItem
                  key={userData.userId}
                  {...userData}
                  isSelected={selectedUserIds.includes(userData.userId)}
                  onClick={() => onUserItemSelected(userData)}
                />
              ))}
            </ListItemContainer>
          </InfiniteScroll>
        ) : null}
      </InfiniteScrollContainer>
    </>
  );
};

interface AllUserListProps {
  onUserItemSelected: (userData: Amity.User) => void;
  selectedUserIds: string[];
  excludeSelf?: boolean;
}

export const AllUserList = ({
  onUserItemSelected,
  selectedUserIds,
  excludeSelf = false,
}: AllUserListProps) => {
  const { users, hasMore, loadMore } = useAllUsersCollection();
  return (
    <UserList
      users={users}
      excludeSelf={excludeSelf}
      hasMore={hasMore}
      loadMore={loadMore}
      selectedUserIds={selectedUserIds}
      onUserItemSelected={onUserItemSelected}
    />
  );
};

interface SearchUserListProps {
  query: string;
  onUserItemSelected: (userData: Amity.User) => void;
  selectedUserIds: string[];
  excludeSelf?: boolean;
}

export const SearchUserList = ({
  query,
  onUserItemSelected,
  selectedUserIds,
  excludeSelf = false,
}: SearchUserListProps) => {
  const { users, hasMore, loadMore } = useUsersCollection({
    displayName: query,
    filter: 'all',
  });
  return (
    <UserList
      users={users}
      excludeSelf={excludeSelf}
      hasMore={hasMore}
      loadMore={loadMore}
      selectedUserIds={selectedUserIds}
      onUserItemSelected={onUserItemSelected}
    />
  );
};
