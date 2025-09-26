import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserRepository, ChannelRepository } from '@amityco/ts-sdk';
import { Typography } from '~/v4/core/components';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Search } from '~/v4/icons/Search';
import CloseIcon from '~/v4/icons/Close';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import { useNotifications } from '~/core/providers/NotificationProvider';
import styles from './styles.module.css';
import { DeleteIcon } from '~/v4/icons/DeleteIcon';
import { useAmityUser } from '~/index';

interface NewGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated?: (channelId: string) => void;
}

interface User {
  userId: string;
  displayName?: string;
  avatarFileId?: string;
}

const NewGroupModal: React.FC<NewGroupModalProps> = ({ isOpen, onClose, onGroupCreated }) => {
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

  const handleUserToggle = useCallback((user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((selected) => selected.userId === user.userId);
      if (isSelected) {
        return prev.filter((selected) => selected.userId !== user.userId);
      } else {
        return [...prev, user];
      }
    });
    // Clear search when user is selected/removed
    setSearchValue('');
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

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.displayName?.toLowerCase().includes(searchValue.toLowerCase()) &&
        !selectedUsers.some((selected) => selected.userId === user.userId),
    );
  }, [users, searchValue, selectedUsers, handleUserToggle, handleRemoveSelectedUser]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Typography.Title className={styles.title}>Nuovo gruppo</Typography.Title>
            <button className={styles.closeButton} onClick={onClose} aria-label="Chiudi">
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Aggiungi partecipante"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Selected Users Display */}
        {selectedUsers.length > 0 && !searchValue && (
          <div className={styles.newGroupSection}>
            <div className={styles.groupNameSection}>
              <input
                type="text"
                placeholder="Nome del gruppo"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className={styles.groupNameInput}
                maxLength={50}
              />
              {/* <Input
                className={styles.groupNameInput}
                placeholder="Nome del gruppo"
                floatingPlaceholder
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={50}
              /> */}
            </div>
            <div className={styles.selectedUsersContainer}>
              <div className={styles.selectedUsersList}>
                {selectedUsers.map((user) => (
                  <div key={user.userId} className={styles.selectedUserItem}>
                    <div className={styles.selectedUserAvatar}>
                      <UserAvatar
                        userId={user.userId}
                        className={styles.selectedUserAvatar}
                        textPlaceholderClassName={styles.cursorDefault}
                        noClick
                      />
                      <DeleteIcon
                        className={styles.removeUserIcon}
                        onClick={() => handleRemoveSelectedUser(user.userId)}
                      />
                    </div>
                    <span className={styles.selectedUserName}>{user.displayName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className={styles.noUsersContainer}>
          {filteredUsers.length > 0 && searchValue && (
            <div className={styles.contentContainer}>
              {/* <div className={styles.sectionTitle}>
            <Typography.Title>Con chi hai interagito di più</Typography.Title>
          </div> */}

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
                    const isSelected = selectedUsers.some(
                      (selected) => selected.userId === user.userId,
                    );

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
                            {/* <Typography.Caption className={styles.userSubtext}>
                          Disponibile per chat
                        </Typography.Caption> */}
                          </div>
                        </div>
                        {/* <div className={styles.userAction}>
                      {isSelected ? (
                        <div className={styles.selectedIndicator}>✓</div>
                      ) : (
                        <button className={styles.addButton}>Aggiungi</button>
                      )}
                    </div> */}
                      </div>
                    );
                  })}
                </InfiniteScroll>
              </div>
            </div>
          )}
        </div>

        {/* Create Group Button */}
        <div className={styles.footer}>
          <button
            className={styles.createButton}
            onClick={handleCreateGroup}
            disabled={selectedUsers.length === 0 || !groupName.trim() || isCreating}
          >
            Crea
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default NewGroupModal;
