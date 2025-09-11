import React from 'react';
import { notificationTray } from '@amityco/ts-sdk';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { Typography } from '~/v4/core/components';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { highlightedText } from '~/v4/social/utils/highlightedText';
import { Button } from '~/v4/core/natives/Button/Button';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
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

  const { AmityNotificationTrayPageBehavior } = usePageBehavior();

  const communityActionTypes = ['poll', 'post', 'join_request'];

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
    } else {
      AmityNotificationTrayPageBehavior?.goToPostDetailPage?.({
        postId:
          item.trayItemCategory === 'reaction_on_post' ||
          item.trayItemCategory === 'mention_in_post' ||
          item.trayItemCategory === 'mention_in_poll'
            ? item.actionReferenceId!
            : item.referenceId!,
        commentId:
          item.trayItemCategory === 'reaction_on_post'
            ? undefined
            : item.actionReferenceId || undefined,
        parentId: item.parentId || undefined,
        hideTarget: item.targetType === 'user' ? true : false,
      });
    }
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
          <UserAvatar
            shouldRedirectToUserProfile={false}
            onPressAvatar={onClickItem}
            pageId={pageId}
            componentId={componentId}
            userData={item.users[0]}
            className={styles.notificationItem__avatar}
          />
          <Typography.Body className={styles.notificationItem__text}>
            {highlightedText(item.templatedText, item.text)}
          </Typography.Body>
        </div>
        <Timestamp pageId={pageId} timestamp={item.lastOccurredAt} />
      </div>
    </Button>
  );
};
