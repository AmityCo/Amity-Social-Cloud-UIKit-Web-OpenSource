import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { Avatar } from '~/v4/core/components/Avatar/Avatar';
import { Button } from '~/v4/core/natives/Button';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import useSDK from '~/core/hooks/useSDK';
import useChannelMembersCollection from '~/chat/hooks/collections/useChannelMembersCollection';
import Chat from '~/v4/icons/Chat';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import Camera from '~/v4/icons/Camera';
import styles from './GroupInfo.module.css';

interface GroupInfoProps {
  channel: Amity.Channel | null;
  onClose: () => void;
  pageId?: string;
  componentId?: string;
  isModal?: boolean; // Se true, usa il modal wrapper
}

interface GroupMember {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  isCurrentUser?: boolean;
}

export const GroupInfo = ({
  channel,
  onClose,
  pageId = '*',
  componentId = 'group_info',
  isModal = false,
}: GroupInfoProps) => {
  const { themeStyles } = useAmityComponent({ pageId, componentId });
  const { onClickUser } = useNavigation();
  const { currentUserId } = useSDK();
  const { isDesktop } = useResponsive();

  // Ottieni i membri reali del canale
  const { channelMembers, hasMore, loadMore, isLoading } = useChannelMembersCollection(
    channel?.channelId,
  );

  // Trasforma i dati dei membri in formato utilizzabile
  const groupMembers: GroupMember[] = useMemo(() => {
    if (!channelMembers) return [];

    return channelMembers.map((member) => ({
      userId: member.user?.userId || member.userId,
      displayName: member.user?.displayName || member.user?.userId || 'Anonymous',
      avatarUrl: member.user?.avatarFileId,
      isAdmin: member.roles?.includes('moderator') || member.roles?.includes('admin') || false,
      isCurrentUser: member.userId === currentUserId,
    }));
  }, [channelMembers, currentUserId]);

  const handleMemberClick = (member: GroupMember) => {
    if (!member.isCurrentUser) {
      onClickUser(member.userId);
    }
  };

  const handleLeaveGroup = () => {
    // Implementa la logica per abbandonare il gruppo
    console.log('Leave group');
  };

  const handleReportGroup = () => {
    // Implementa la logica per segnalare il gruppo
    console.log('Report group');
  };

  const GroupInfoContent = () => (
    <div className={styles.groupInfo} style={themeStyles}>
      {/* Header scuro con freccia indietro - Solo su desktop */}
      <div className={styles.darkHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={onClose}>
              <ChevronLeft className={styles.backIcon} />
            </button>
          </div>
          <div className={styles.headerCenter}>
            <Typography.TitleBold className={styles.headerTitle}>
              {channel?.displayName || 'Info Gruppo'}
            </Typography.TitleBold>
          </div>
          <div className={styles.headerRight} />
        </div>
      </div>

      {/* Header mobile - Solo su mobile, usa la navigazione esistente */}
      {!isDesktop && (
        <div className={styles.mobileHeader}>
          <button className={styles.mobileBackButton} onClick={onClose}>
            <ChevronLeft className={styles.mobileBackIcon} />
          </button>
          <Typography.TitleBold className={styles.mobileHeaderTitle}>
            {channel?.displayName || 'Info Gruppo'}
          </Typography.TitleBold>
          <div className={styles.mobileHeaderRight} />
        </div>
      )}

      {/* Content area */}
      <div className={styles.contentArea}>
        {/* Group card con avatar e nome */}
        <div className={styles.groupCard}>
          <div className={styles.groupRow}>
            <div className={styles.avatarContainer}>
              <div className={styles.editableAvatar}>
                <Avatar
                  avatarUrl={channel?.avatarFileId}
                  defaultImage={<Chat />}
                  containerClassName={styles.groupAvatar}
                />
                <div className={styles.cameraOverlay}>
                  <Camera className={styles.cameraIcon} />
                </div>
              </div>
            </div>
            <div className={styles.groupNameContainer}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={channel?.displayName || 'Nome del gruppo'}
                  className={styles.groupNameInput}
                  readOnly
                />
                <label className={styles.inputLabel}>Nome del gruppo</label>
              </div>
            </div>
          </div>

          {/* Membri section */}
          <div className={styles.membersSection}>
            <Typography.TitleBold className={styles.membersTitle}>Membri:</Typography.TitleBold>

            <div className={styles.membersList}>
              {isLoading ? (
                <div className={styles.loadingState}>
                  <Typography.Body>Caricamento membri...</Typography.Body>
                </div>
              ) : groupMembers.length > 0 ? (
                groupMembers.map((member) => (
                  <div
                    key={member.userId}
                    className={styles.memberItem}
                    onClick={() => handleMemberClick(member)}
                    role={!member.isCurrentUser ? 'button' : undefined}
                    tabIndex={!member.isCurrentUser ? 0 : undefined}
                  >
                    <div className={styles.memberInfo}>
                      <Avatar
                        avatarUrl={member.avatarUrl}
                        defaultImage={<Chat />}
                        containerClassName={styles.memberAvatar}
                      />
                      <div className={styles.memberText}>
                        <Typography.BodyBold className={styles.memberName}>
                          {member.isCurrentUser ? 'Tu' : member.displayName}
                        </Typography.BodyBold>
                      </div>
                    </div>
                    {member.isAdmin && (
                      <div className={styles.adminBadge}>
                        <Typography.Caption className={styles.adminText}>
                          Amministratore
                        </Typography.Caption>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Typography.Body>Nessun membro trovato</Typography.Body>
                </div>
              )}

              {hasMore && !isLoading && (
                <div className={styles.loadMoreSection}>
                  <Button className={styles.loadMoreButton} onPress={loadMore}>
                    <Typography.Body>Carica altri membri</Typography.Body>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions footer */}
      <div className={styles.actionsFooter}>
        <div className={styles.buttonGroup}>
          <button className={styles.leaveButton} onClick={handleLeaveGroup}>
            <Typography.BodyBold>Abbandona gruppo</Typography.BodyBold>
          </button>
          <button className={styles.reportButton} onClick={handleReportGroup}>
            <Typography.BodyBold>Segnala gruppo</Typography.BodyBold>
          </button>
        </div>
      </div>
    </div>
  );

  // Se è desktop e modal, usa createPortal
  if (isModal && isDesktop) {
    return createPortal(
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <GroupInfoContent />
        </div>
      </div>,
      document.body,
    );
  }

  // Altrimenti restituisci il contenuto direttamente
  return <GroupInfoContent />;
};
