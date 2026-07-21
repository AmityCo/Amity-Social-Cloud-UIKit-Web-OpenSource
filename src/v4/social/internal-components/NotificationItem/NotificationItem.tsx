import { useState } from 'react';
import { FileRepository, notificationTray } from '@amityco/ts-sdk';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import { Typography } from '~/v4/core/components';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { EventTypeBadge } from '~/v4/social/features/events/EventHub/elements';
import { formatEventStartDate, formatEventStartTime } from '~/v4/social/utils/timezone';
import { highlightedText } from '~/v4/social/utils/highlightedText';
import { Button } from '~/v4/core/natives/Button/Button';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useRoom } from '~/v4/social/features/livestream/hooks';
import LiveIndicator from '~/v4/icons/LiveIndicator';
const EVENT_TRAY_CATEGORIES = ['event_created', 'event_reminder', 'event_started'];
import eventThumbnail from '~/v4/social/assets/images/event-default-thumbnail.png';
import styles from './NotificationItem.module.css';

type NotificationItemProps = {
  pageId?: string;
  componentId?: string;
  item: Amity.NotificationTrayItem;
  onClose?: () => void;
};

export const NotificationItem = ({
  pageId = '*',
  componentId = '*',
  item,
  onClose,
}: NotificationItemProps) => {
  const { accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });
  const [errorImage, setErrorImage] = useState(false);
  const { AmityNotificationTrayPageBehavior } = usePageBehavior();

  const communityActionTypes = ['poll', 'post', 'join_request'];

  const renderCommentId = (item: Amity.NotificationTrayItem) => {
    const { parentId, latestCommentId, actionReferenceId, trayItemCategory } = item;
    if (trayItemCategory === 'reaction_on_post') return undefined;
    if (parentId === null) return actionReferenceId;

    return latestCommentId;
  };

  const onClickItem = () => {
    onClose?.();
    notificationTray.markItemsSeen([
      {
        id: item._id,
        lastSeenAt: new Date().toISOString(),
      },
    ]);

    if (communityActionTypes.includes(item.actionType)) {
      return AmityNotificationTrayPageBehavior?.goToCommunityProfilePage?.({
        communityId: item.targetId,
      });
    } else if (item.trayItemCategory === 'follow') {
      return AmityNotificationTrayPageBehavior?.goToUserProfilePage?.({
        userId: item.actors[0]?.publicId,
      });
    } else if (EVENT_TRAY_CATEGORIES.includes(item.trayItemCategory as string)) {
      return AmityNotificationTrayPageBehavior?.goToEventDetailPage?.({
        eventId: item.actionReferenceId!,
      });
    } else if (item.trayItemCategory === 'room_cohost_invite') {
      return AmityNotificationTrayPageBehavior?.goToLivestreamPlayerPage?.({
        roomId: item.targetId,
      });
    } else if (item.actionType === 'user') {
      return AmityNotificationTrayPageBehavior?.goToEditProfilePage?.();
    } else {
      AmityNotificationTrayPageBehavior?.goToPostDetailPage?.({
        postId:
          item.trayItemCategory === 'reaction_on_post' ||
          item.trayItemCategory === 'mention_in_post' ||
          item.trayItemCategory === 'mention_in_poll'
            ? item.actionReferenceId!
            : item.referenceId!,
        commentId: renderCommentId(item),
        parentId: item.parentId ?? undefined,
        rootId: item.rootId,
        hideTarget: item.targetType === 'user' ? true : false,
      });
    }
  };

  const isEventCreated = item.trayItemCategory === 'event_created' && item.event != null;

  const eventCommunityId =
    isEventCreated && item.event?.originType === 'community' ? item.event?.originId : undefined;
  const { community: eventCommunity } = useCommunity({
    communityId: eventCommunityId,
    shouldCall: !!eventCommunityId,
  });

  // Show the LIVE badge on a co-host invitation only while the room is
  // actually live — otherwise the badge lingers past the stream (PDT-3896).
  const isCoHostInvite = item.trayItemCategory === 'room_cohost_invite';
  const { room: coHostInviteRoom } = useRoom(isCoHostInvite ? item.targetId : undefined);
  const showCoHostLiveBadge = isCoHostInvite && coHostInviteRoom?.status === 'live';

  const renderLeadingAvatar = () => {
    if (isEventCreated) {
      return (
        <CommunityAvatar
          pageId={pageId}
          componentId={componentId}
          community={eventCommunity ?? item.event?.targetCommunity}
          className={styles.notificationItem__avatar}
        />
      );
    }

    if (item.event) {
      return (
        <img
          onError={() => setErrorImage(true)}
          data-size="small"
          className={styles.notificationItem__eventCover}
          src={
            errorImage
              ? eventThumbnail
              : item.event.coverImage
                ? FileRepository.fileUrlWithSize(item.event.coverImage?.fileUrl, 'medium')
                : eventThumbnail
          }
        />
      );
    }

    const avatar = (
      <UserAvatar
        shouldRedirectToUserProfile={false}
        onPressAvatar={onClickItem}
        pageId={pageId}
        componentId={componentId}
        userData={item.actionType === 'user' ? undefined : item.users[0]}
        className={styles.notificationItem__avatar}
      />
    );

    if (showCoHostLiveBadge) {
      return (
        <div className={styles.notificationItem__avatarWithBadge}>
          {avatar}
          <LiveIndicator className={styles.notificationItem__liveBadge} />
        </div>
      );
    }

    return avatar;
  };

  return (
    <Button
      key={item._id}
      data-testid={`${accessibilityId}_notification_item`}
      onPress={() => onClickItem()}
      className={styles.notificationItem__button}
      data-isseen={item.isSeen}
    >
      <div className={styles.notificationItem}>
        <div className={styles.notificationItem__userInfo}>
          {renderLeadingAvatar()}
          <div className={styles.notificationItem__content}>
            <Typography.Body className={styles.notificationItem__text}>
              {highlightedText(item.templatedText, item.text)}
            </Typography.Body>
            {isEventCreated && (
              <div
                data-testid={`${accessibilityId}_event_notification_item`}
                className={styles.notificationItem__eventContext}
              >
                {item.event?.type && <EventTypeBadge type={item.event.type} />}
                <Typography.Caption className={styles.notificationItem__eventDateTime}>
                  {formatEventStartDate(item.event!.startTime)}
                </Typography.Caption>
                <Typography.Caption className={styles.notificationItem__eventDateTime}>
                  {formatEventStartTime(item.event!.startTime)}
                </Typography.Caption>
              </div>
            )}
          </div>
        </div>
        <Timestamp pageId={pageId} timestamp={item.lastOccurredAt} />
      </div>
    </Button>
  );
};
