import { useState } from 'react';
import { FileRepository, notificationTray } from '@amityco/ts-sdk';
import { useAmityComponent, useAmityElement } from '~/v4/core/hooks/uikit';
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
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { resolveString } from '~/v4/core/localization';
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
  const { isTargetReachable } = useNavigation();
  const notification = useNotifications();

  // A tray item can name content inside the page rather than the page itself,
  // and the two belong to different modules: a comment or a poll mention opens
  // post_detail_page, which is Post's, while the thread and the poll body are
  // Comment's and Poll's. `isTargetReachable` asks about the page, so with
  // Comment off the page was reachable, the tap went through, and the customer
  // landed on a post with no thread — the comment they were told about nowhere
  // on it, and the commentId passed along with the navigation pointing at
  // nothing.
  //
  // Asked through the hooks rather than resolved here, so the tray reads the
  // same tables as the surfaces it is asking about.
  const commentContent = useAmityComponent({
    pageId: 'post_detail_page',
    componentId: 'comment_tray_component',
  });
  const pollContent = useAmityElement({
    pageId: 'post_detail_page',
    componentId: '*',
    elementId: 'post_poll',
  });

  const communityActionTypes = ['poll', 'post', 'join_request'];

  /**
   * A comment is the subject either way it is named.
   *
   * `trayItemCategory` is optional on the wire, and an item can arrive carrying
   * only `actionType: 'comment'` — reading the category alone missed exactly
   * those and let the tap through. `reaction` and `mention` say what happened
   * rather than to what, so for those the category is the only thing that
   * knows, which is why both are read.
   */
  const COMMENT_ACTION_TYPES = ['comment', 'reply'];
  const COMMENT_CATEGORIES = [
    'reaction_on_comment',
    'reaction_on_reply',
    'mention_in_comment',
    'mention_in_reply',
  ];

  /**
   * Whether the thing this item is about has been withheld, even though the
   * page holding it has not. Only items naming content need it; for the rest
   * the page and the subject are the same thing.
   */
  const isSubjectWithheld = () => {
    const category = item.trayItemCategory as string;

    if (COMMENT_ACTION_TYPES.includes(item.actionType)) return commentContent.isExcluded;
    if (COMMENT_CATEGORIES.includes(category)) return commentContent.isExcluded;
    if (category === 'mention_in_poll') return pollContent.isExcluded;

    return false;
  };

  /**
   * Which page this item opens.
   *
   * The same branches as `onClickItem`, in the same order, so one added to that
   * without this one reads as a stray default rather than hiding. A tray item
   * cannot be withheld the way a button can — the server already sent the
   * notification, and it is history rather than a capability — so the module
   * behind its destination has to be asked here instead.
   */
  const targetPage = (): PageTypes => {
    if (communityActionTypes.includes(item.actionType)) return PageTypes.CommunityProfilePage;
    if (item.trayItemCategory === 'follow') return PageTypes.UserProfilePage;
    if (EVENT_TRAY_CATEGORIES.includes(item.trayItemCategory as string))
      return PageTypes.EventDetailPage;
    if (item.trayItemCategory === 'room_cohost_invite') return PageTypes.LiveStreamPlayerPage;
    if (item.actionType === 'user') return PageTypes.EditUserProfilePage;
    return PageTypes.PostDetailPage;
  };

  const renderCommentId = (item: Amity.NotificationTrayItem) => {
    const { parentId, latestCommentId, actionReferenceId, trayItemCategory } = item;
    if (trayItemCategory === 'reaction_on_post') return undefined;
    if (parentId === null) return actionReferenceId;

    return latestCommentId;
  };

  const onClickItem = () => {
    // Seen either way: the customer tapped it, whether or not it opened.
    notificationTray.markItemsSeen([
      {
        id: item._id,
        lastSeenAt: new Date().toISOString(),
      },
    ]);

    if (!isTargetReachable(targetPage()) || isSubjectWithheld()) {
      // `pushPage` would refuse this silently, which leaves a tap that does
      // nothing. The tray stays open on purpose — closing it would leave a
      // toast explaining a screen the customer is no longer looking at.
      notification.error({
        content: resolveString('amity_social_toast_failed_generic'),
        testId: 'notification-item-unavailable',
      });
      return;
    }

    onClose?.();

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

  const isEventDeleted =
    EVENT_TRAY_CATEGORIES.includes(item.trayItemCategory as string) && item.event == null;

  const eventCommunityId =
    isEventCreated && item.event?.originType === 'community' ? item.event?.originId : undefined;
  const deletedEventCommunityId =
    isEventDeleted && item.targetType === 'community' ? item.targetId : undefined;
  const { community: eventCommunity } = useCommunity({
    communityId: eventCommunityId ?? deletedEventCommunityId,
    shouldCall: !!(eventCommunityId ?? deletedEventCommunityId),
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

    if (isEventDeleted) {
      return (
        <CommunityAvatar
          pageId={pageId}
          componentId={componentId}
          community={eventCommunity}
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
