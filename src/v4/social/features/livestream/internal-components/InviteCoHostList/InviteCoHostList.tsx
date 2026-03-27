import React, { FC, useCallback, useMemo } from 'react';
import { Typography } from '~/v4/core/components';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { InviteButton } from '~/v4/social/elements/InviteButton';
import styles from './InviteCoHostList.module.css';
import AddUser from '~/v4/icons/AddUser';
import UserOfficialBadge from '~/v4/icons/UserOfficialBadge';
import useRoomInvitationsCollection from '~/v4/social/hooks/collections/useRoomInvitationsCollection';
import {
  useCreateInvitation,
  useCancelInvitation,
  useRemoveParticipant,
  useWatchingUsers,
} from '~/v4/social/features/livestream/hooks';
import { Button } from '~/v4/core/components/AriaButton';
import { UserListItemSkeleton } from '~/v4/social/internal-components/Skeleton';
import { BrandBadge } from '~/v4/social/elements';

export interface InviteCoHostListProps {
  pageId?: string;
  room?: Amity.Room | null;
  coHost?: Amity.RoomParticipant;
  invitation?: Amity.Invitation;
  onAction?: () => void;
}

interface WatchingUserItemProps {
  user: Amity.User;
  pageId?: string;
  componentId?: string;
  isInvited?: boolean;
  isCoHost?: boolean;
  isLoading?: boolean;

  hasPendingInvitation?: boolean;
  hasCoHost?: boolean;
  onInviteUser?: (userId: string) => void;
  onCancelInvite?: (userId: string) => void;
  onRemoveCoHost?: () => void;
}

const WatchingUserItem: FC<WatchingUserItemProps> = ({
  user,
  pageId = '*',
  componentId = '*',
  isInvited,
  isCoHost,
  isLoading,
  hasPendingInvitation,
  hasCoHost,
  onInviteUser,
  onCancelInvite,
  onRemoveCoHost,
}) => {
  const handleInvite = () => {
    onInviteUser?.(user?.userId);
  };

  const handleCancel = () => {
    onCancelInvite?.(user?.userId);
  };

  return (
    <div className={styles.watchingUserItem}>
      <div className={styles.watchingUserItem__userInfo}>
        <UserAvatar
          userId={user?.userId}
          pageId={pageId}
          componentId={componentId}
          className={styles.watchingUserItem__avatar}
          shouldRedirectToUserProfile={false}
        />
        <Typography.BodyBold className={styles.watchingUserItem__displayName}>
          {user?.displayName || user?.userId}
        </Typography.BodyBold>
        {user?.isBrand && <BrandBadge />}
      </div>
      {isInvited ? (
        <Button
          size="medium"
          type="button"
          variant="outlined"
          color="secondary"
          data-testid={`${pageId}/*/cancel_invitation`}
          onPress={handleCancel}
          isDisabled={isLoading}
        >
          Cancel
        </Button>
      ) : isCoHost ? (
        <Button
          size="medium"
          type="button"
          color="primary"
          data-testid={`${pageId}/*/remove_co_host`}
          onPress={onRemoveCoHost}
          isDisabled={isLoading}
        >
          Remove
        </Button>
      ) : (
        <InviteButton
          pageId={pageId}
          componentId={componentId}
          onPress={handleInvite}
          isDisabled={isLoading || hasPendingInvitation || hasCoHost}
        />
      )}
    </div>
  );
};

export const InviteCoHostList: React.FC<InviteCoHostListProps> = ({
  pageId = '*',
  room,
  coHost,
  invitation,
  onAction,
}) => {
  const componentId = 'inivte_co_host_list';
  const { watchingUsers, isLoading } = useWatchingUsers({ room });

  const { handleCreateInvitation, isPending: isPendingCreateInvitation } = useCreateInvitation({
    room,
    pageId,
  });
  const { cancelInvitation, isPending: isPendingCancelInvitation } = useCancelInvitation({
    pageId,
  });

  const { handleRemoveParticipant } = useRemoveParticipant({ room });

  const onCreateInvitation = (userId: string) =>
    handleCreateInvitation(userId, {
      onSuccess: onAction,
    });

  const onCancelInvitation = (invitationId?: string) =>
    invitationId &&
    cancelInvitation(invitationId, {
      onSuccess: onAction,
    });

  const onRemoveCoHost = () => coHost?.userId && handleRemoveParticipant(coHost?.userId);

  const renderHeader = useCallback((text: string) => {
    return (
      <Typography.TitleBold className={styles.inviteCoHostList__sectionHeader}>
        {text}
      </Typography.TitleBold>
    );
  }, []);

  const pendingInvitation = useMemo(() => {
    if (invitation?.status !== 'pending') return;
    else return invitation;
  }, [invitation?.status, invitation?.user?.userId]);

  // Filter out pending invitation user and co-host from watching users
  const filteredWatchingUsers = useMemo(() => {
    return watchingUsers.filter((user) => {
      const isPendingUser = pendingInvitation?.user?.userId === user.userId;
      const isCoHostUser = coHost?.userId === user.userId;
      return !isPendingUser && !isCoHostUser;
    });
  }, [watchingUsers, pendingInvitation?.user?.userId, coHost?.userId]);

  if (isLoading)
    return (
      <div className={styles.inviteCoHostList__skeletonWrapper}>
        {Array.from({ length: 3 }).map((_, index) => (
          <UserListItemSkeleton key={index} />
        ))}
      </div>
    );

  if (watchingUsers?.length === 0 && !isLoading) {
    return (
      <div className={styles.inviteCoHostList__empty}>
        <AddUser className={styles.inviteCoHostList__emptyIcon} />
        <Typography.TitleBold className={styles.inviteCoHostList__emptyText}>
          No viewers available right now
        </Typography.TitleBold>
        <Typography.Caption className={styles.inviteCoHostList__emptyText}>
          Viewers who join your livestream will appear here.
        </Typography.Caption>
      </div>
    );
  }

  return (
    <div className={styles.inviteCoHostList}>
      {coHost?.user && (
        <>
          {renderHeader('Co-hosting')}
          <WatchingUserItem
            user={coHost?.user}
            pageId={pageId}
            componentId={componentId}
            onRemoveCoHost={onRemoveCoHost}
            isCoHost={true}
          />
        </>
      )}

      {pendingInvitation?.user && (
        <>
          {renderHeader('Pending invitation')}
          <WatchingUserItem
            user={pendingInvitation?.user}
            pageId={pageId}
            componentId={componentId}
            onCancelInvite={() => cancelInvitation(pendingInvitation.invitationId)}
            isInvited={true}
          />
        </>
      )}

      {filteredWatchingUsers.length > 0 && (
        <>
          {renderHeader("Who's watching")}
          {filteredWatchingUsers.map((user) => (
            <WatchingUserItem
              key={user.userId}
              user={user}
              pageId={pageId}
              componentId={componentId}
              onInviteUser={() => onCreateInvitation(user.userId)}
              onCancelInvite={() => onCancelInvitation(pendingInvitation?.invitationId)}
              isLoading={isPendingCreateInvitation || isPendingCancelInvitation}
              hasPendingInvitation={!!pendingInvitation}
              hasCoHost={!!coHost}
            />
          ))}
        </>
      )}
    </div>
  );
};
