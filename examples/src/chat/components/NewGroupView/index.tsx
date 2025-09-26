import React, { useState, useCallback, useMemo } from 'react';
import { ChannelRepository } from '@amityco/ts-sdk';
import { Typography } from '~/v4/core/components';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Search } from '~/v4/icons/Search';
import CloseIcon from '~/v4/icons/Close';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import { useNotifications } from '~/core/providers/NotificationProvider';
import styles from './styles.module.css';

interface NewGroupViewProps {
  onClose: () => void;
  onGroupCreated?: (channelId: string) => void;
}

interface User {
  userId: string;
  displayName?: string;
  avatarFileId?: string;
}

const NewGroupView: React.FC<NewGroupViewProps> = ({ onClose, onGroupCreated }) => {
  const notification = useNotifications();
  const [searchValue, setSearchValue] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { users, hasMore, loadMore } = useUserQueryByDisplayName({
    displayName: searchValue,
    limit: 20,
    enabled: searchValue.length >= 2,
  });

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.displayName?.toLowerCase().includes(searchValue.toLowerCase()) &&
        !selectedUsers.some((selected) => selected.userId === user.userId),
    );
  }, [users, searchValue, selectedUsers]);

  const handleUserToggle = useCallback((user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((selected) => selected.userId === user.userId);
      if (isSelected) {
        return prev.filter((selected) => selected.userId !== user.userId);
      } else {
        return [...prev, user];
      }
    });
  }, []);

  const handleCreateGroup = useCallback(async () => {
    if (selectedUsers.length === 0 || !groupName.trim()) return;

    setIsCreating(true);
    try {
      const userIds = selectedUsers.map((user) => user.userId);
      const { data: channel } = await ChannelRepository.createChannel({
        type: 'conversation',
        userIds,
        displayName: groupName.trim(),
      });

      notification.success({
        content: 'Gruppo creato con successo!',
      });

      const channelId = (channel as any)?.channelId || channel?.channelId;
      onGroupCreated?.(channelId);

      setSelectedUsers([]);
      setGroupName('');
      setSearchValue('');
      onClose();
    } catch (error) {
      console.error('Errore nella creazione del gruppo:', error);
      notification.error({
        content: 'Errore nella creazione del gruppo. Riprova.',
      });
    } finally {
      setIsCreating(false);
    }
  }, [selectedUsers, groupName, onClose, onGroupCreated, notification]);

  const handleRemoveSelectedUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.userId !== userId));
  }, []);

  const canCreateGroup = selectedUsers.length > 0 && groupName.trim();

  return (
    <div className={styles.newGroupView}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onClose} aria-label="Chiudi">
          <CloseIcon width={24} height={24} />
        </button>
        <Typography.Title className={styles.title}>Nuovo gruppo</Typography.Title>
        <button
          className={`${styles.nextButton} ${!canCreateGroup ? styles.nextButtonDisabled : ''}`}
          onClick={handleCreateGroup}
          disabled={!canCreateGroup || isCreating}
        >
          <Typography.BodyBold className={styles.nextButtonText}>
            {isCreating ? 'Creazione...' : 'Avanti'}
          </Typography.BodyBold>
        </button>
      </div>

      {/* Group Name Input */}
      <div className={styles.groupNameSection}>
        <input
          type="text"
          placeholder="Nome del gruppo"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className={styles.groupNameInput}
          maxLength={50}
        />
      </div>

      {/* Search */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Cerca"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Selected Users Display */}
      {selectedUsers.length > 0 && (
        <div className={styles.selectedUsersContainer}>
          <div className={styles.selectedUsersList}>
            {selectedUsers.map((user) => (
              <div key={user.userId} className={styles.selectedUserItem}>
                <UserAvatar userId={user.userId} className={styles.selectedUserAvatar} />
                <span className={styles.selectedUserName}>{user.displayName}</span>
                <button
                  onClick={() => handleRemoveSelectedUser(user.userId)}
                  className={styles.removeSelectedUser}
                  aria-label={`Rimuovi ${user.displayName}`}
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users List */}
      <div className={styles.contentContainer}>
        <div className={styles.sectionTitle}>
          <Typography.Title>Con chi hai interagito di più</Typography.Title>
        </div>

        <div className={styles.usersList} id="newGroupUsersList">
          <InfiniteScroll
            dataLength={filteredUsers.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<div className={styles.loader}>Caricamento...</div>}
            scrollableTarget="newGroupUsersList"
            style={{ overflow: 'visible' }}
          >
            {filteredUsers.map((user) => {
              const isSelected = selectedUsers.some((selected) => selected.userId === user.userId);

              return (
                <div
                  key={user.userId}
                  className={`${styles.userItem} ${isSelected ? styles.userItemSelected : ''}`}
                  onClick={() => handleUserToggle(user)}
                >
                  <div className={styles.userInfo}>
                    <UserAvatar userId={user.userId} className={styles.userAvatar} />
                    <div className={styles.userDetails}>
                      <Typography.Body className={styles.userName}>
                        {user.displayName}
                      </Typography.Body>
                      <Typography.Caption className={styles.userSubtext}>
                        Disponibile per chat
                      </Typography.Caption>
                    </div>
                  </div>
                  <div className={styles.userAction}>
                    {isSelected ? (
                      <div className={styles.selectedIndicator}>✓</div>
                    ) : (
                      <button className={styles.addButton}>Aggiungi</button>
                    )}
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default NewGroupView;
