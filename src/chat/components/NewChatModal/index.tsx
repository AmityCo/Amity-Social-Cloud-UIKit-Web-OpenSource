import React, { useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { ChannelRepository } from '@amityco/ts-sdk';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { Typography } from '~/v4/core/components';
import { Search } from '~/v4/icons/Search';
import { useNotifications } from '~/core/providers/NotificationProvider';
import { useSDK } from '~/core/hooks/useSDK';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import CloseIcon from '~/v4/icons/Close';

import styles from './styles.module.css';

type Props = {
  onClose: () => void;
  onChannelCreated?: (channelId: string) => void;
};

const NewChatView = ({ onClose, onChannelCreated }: Props) => {
  const { formatMessage } = useIntl();
  const notification = useNotifications();
  const { currentUserId } = useSDK();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { users, hasMore, loadMore, isLoading } = useUserQueryByDisplayName({
    displayName: searchQuery,
    limit: 20,
    enabled: searchQuery.length >= 2,
  });

  const filteredUsers = users.filter((user) => user.userId !== currentUserId);

  const handleUserSelect = async (selectedUser: Amity.User) => {
    try {
      const channelData = await ChannelRepository.createChannel({
        type: 'conversation',
        userIds: [selectedUser.userId],
        metadata: {
          isDirectChat: true,
          userIds: [currentUserId, selectedUser.userId],
        },
      });

      notification.success({
        content: formatMessage({ id: 'chat.newChat.success' }, { name: selectedUser.displayName }),
      });

      const channelId = (channelData as any)?.channelId || (channelData as any)?.data?.channelId;
      onChannelCreated?.(channelId);
      onClose();
    } catch (error) {
      console.error('Error creating chat:', error);
      notification.error({
        content: formatMessage({ id: 'chat.newChat.error' }),
      });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className={styles.newChatView}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onClose} aria-label="Back">
          <ChevronLeft width={24} height={24} />
        </button>
        <Typography.Title className={styles.title}>Nuova chat</Typography.Title>
        <div className={styles.headerSpacer} />
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <div className={styles.searchIcon}>
            <Search width={20} height={20} />
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Cerca contatti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className={styles.clearButton} onClick={handleClearSearch} aria-label="Clear">
              <CloseIcon width={20} height={20} />
            </button>
          )}
        </div>
      </div>

      {/* User List */}
      <div className={styles.content}>
        {searchQuery.length >= 2 ? (
          <div className={styles.userList} ref={scrollContainerRef}>
            {scrollContainerRef.current ? (
              <InfiniteScroll
                scrollableTarget={scrollContainerRef.current}
                hasMore={hasMore}
                next={loadMore}
                loader={isLoading ? <div className={styles.loading}>Loading...</div> : null}
                dataLength={filteredUsers.length}
                height={scrollContainerRef.current.clientHeight}
              >
                {filteredUsers.map((user) => (
                  <div
                    key={user.userId}
                    className={styles.userItem}
                    onClick={() => handleUserSelect(user)}
                  >
                    <UserAvatar userId={user.userId} className={styles.userAvatar} />
                    <div className={styles.userInfo}>
                      <Typography.BodyBold className={styles.userName}>
                        {user.displayName || user.userId}
                      </Typography.BodyBold>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            ) : null}

            {!isLoading && filteredUsers.length === 0 && searchQuery.length >= 2 && (
              <div className={styles.noResults}>
                <Typography.Body>Nessun utente trovato</Typography.Body>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.searchPrompt}>
            <Typography.Body>Inizia a digitare per cercare contatti</Typography.Body>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewChatView;
