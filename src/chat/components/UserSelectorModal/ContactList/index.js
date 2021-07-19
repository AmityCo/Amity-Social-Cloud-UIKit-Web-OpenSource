import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroller';

import SolarSystemIcon from '~/icons/SolarSystem';
import useUserQuery from '~/core/hooks/useUserQuery';
import useAllUsers from '~/core/hooks/useAllUsers';
import EmptyState from '~/core/components/EmptyState';
import withSDK from '~/core/hocs/withSDK';

import UserItem from '../UserItem';
import { ListItemContainer, EmptyStateIcon, WrapEmptyState } from './styles';

// this component will exclude current user
const UserList = withSDK(
  ({
    users,
    hasMore,
    loadMore,
    selectedUserIds,
    onUserItemSelected,
    currentUserId,
    excludeSelf,
  }) => {
    const { formatMessage } = useIntl();

    const filterUsers = excludeSelf
      ? users.filter(({ userId }) => userId !== currentUserId)
      : users;

    return (
      <Fragment>
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

        {filterUsers && (
          <InfiniteScroll
            useWindow={false}
            initialLoad={false}
            hasMore={hasMore}
            loadMore={loadMore}
            loader={<span key={0}>Loading...</span>}
          >
            <ListItemContainer>
              {filterUsers.map(userData => (
                <UserItem
                  key={userData.userId}
                  {...userData}
                  isSelected={
                    selectedUserIds.hasOwnProperty(userData.userId)
                      ? selectedUserIds[userData.userId]
                      : false
                  }
                  onClick={() => onUserItemSelected(userData)}
                />
              ))}
            </ListItemContainer>
          </InfiniteScroll>
        )}
      </Fragment>
    );
  },
);

export function AllUserList({ onUserItemSelected, selectedUserIds, excludeSelf = false }) {
  const [users, hasMore, loadMore] = useAllUsers();
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
}

export function SearchUserList({
  query,
  onUserItemSelected,
  selectedUserIds,
  excludeSelf = false,
}) {
  const [users, hasMore, loadMore] = useUserQuery(query);
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
}
