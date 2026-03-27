import React, { useState, useRef, useEffect } from 'react';
import styles from './UserProfileHeader.module.css';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { UserFollowing } from '~/v4/social/elements/UserFollowing/UserFollowing';
import { UserFollower } from '~/v4/social/elements/UserFollower/UserFollower';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { UserName } from '~/v4/social/elements/UserName/UserName';
import { UserDescription } from '~/v4/social/elements/UserDescription/UserDescription';
import UserOfficialBadge from '~/v4/icons/UserOfficialBadge';
import useSDK from '~/v4/core/hooks/useSDK';
import { FollowUserButton } from '~/v4/social/elements/FollowUserButton';
import { FollowingUserButton } from '~/v4/social/elements/FollowingUserButton';
import { PendingUserButton } from '~/v4/social/elements/PendingUserButton';
import { UnblockUserButton } from '~/v4/social/elements/UnblockUserButton/UnblockUserButton';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components';
import NotificationIndicator from '~/v4/icons/NotificationIndicator';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import useUserFollow from '~/v4/social/hooks/useUserFollow';
import UserTimes from '~/v4/icons/UserTimes';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import useUserBlock from '~/v4/social/hooks/useUserBlock';
import { FileImageViewer } from '~/v4/social/internal-components/FileImageViewer';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useNetworkState } from 'react-use';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';

interface UserProfileHeaderProps {
  user?: Amity.User | null;
  pageId?: string;
}

const calculateLineHeight = (element: HTMLElement): number => {
  const computedStyle = getComputedStyle(element);
  const lineHeight = parseFloat(computedStyle.lineHeight);

  if (isNaN(lineHeight)) {
    const fontSize = parseFloat(computedStyle.fontSize);
    return fontSize * 1.2;
  }

  return lineHeight;
};

const useMultiLineDetection = (
  containerRef: React.RefObject<HTMLElement>,
  dependencies: [string | undefined, string | undefined],
) => {
  const [isMultiLine, setIsMultiLine] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const timer = setTimeout(() => {
      const element = containerRef.current?.querySelector('[data-testid*="user_name"]');
      if (!element) return;

      const textElement = element.querySelector('div') || element;
      const lineHeight = calculateLineHeight(textElement as HTMLElement);
      const height = textElement.clientHeight;
      const lineCount = height / lineHeight;

      setIsMultiLine(lineCount > 1.5);
    }, 0);

    return () => clearTimeout(timer);
  }, dependencies);

  return isMultiLine;
};

const UserProfileHeaderSkeleton: React.FC = () => {
  return (
    <div className={styles.userProfileHeader__skeleton}>
      <div className={styles.userProfileHeader__skeleton__header}>
        <div className={styles.userProfileHeader__skeleton__avatar}></div>
        <div className={styles.userProfileHeader__skeleton__displayName}></div>
      </div>
      <div>
        <div className={styles.userProfileHeader__skeleton__about}></div>
        <div className={styles.userProfileHeader__skeleton__about}></div>
      </div>
      <div className={styles.userProfileHeader__skeleton__relationship}>
        <div className={styles.userProfileHeader__skeleton__relationship__text}></div>
        <div className={styles.userProfileHeader__skeleton__relationship__text}></div>
      </div>
    </div>
  );
};

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ user, pageId = '*' }) => {
  const componentId = 'user_profile_header';
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const displayNameRef = useRef<HTMLDivElement>(null);

  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();
  const { currentUserId, isVisitorOrBot } = useSDK();
  const { themeStyles, accessibilityId } = useAmityComponent({ pageId, componentId });
  const { AmityUserProfileHeaderComponentBehavior, AmityGlobalBehavior } = usePageBehavior();
  const { followStatus, pendingCount } = useFollowCount(user?.userId);
  const { followUser, unFollowUser, cancelFollow } = useUserFollow();
  const { unblockUser } = useUserBlock();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { online } = useNetworkState();
  const notification = useNotifications();
  const { isDesktop } = useResponsive();

  const isMultiLine = useMultiLineDetection(displayNameRef, [user?.displayName, user?.userId]);

  const unFollowUserButton = ({
    onClickButton,
    userId,
  }: {
    onClickButton?: () => void;
    userId: string;
  }) => (
    <Button
      className={styles.userProfileHeader__unFollowButton}
      onPress={() => {
        removeDrawerData();
        unFollowUser({ pageId, userId });
        onClickButton?.();
      }}
      variant="text"
    >
      <UserTimes className={styles.userProfileHeader__unFollowButton__icon} />
      <Typography.BodyBold className={styles.userProfileHeader__unFollowButton__text}>
        Unfollow
      </Typography.BodyBold>
    </Button>
  );

  const onPressFollowingButton = (userId: string) => {
    setDrawerData({
      content: unFollowUserButton({
        userId,
      }),
    });
  };

  const renderFollowingButton = (userId: string) => (
    <Popover
      trigger={({ openPopover }) => (
        <FollowingUserButton
          pageId={pageId}
          componentId={componentId}
          onClick={() => {
            if (!isDesktop) onPressFollowingButton(userId);
            else openPopover();
          }}
        />
      )}
    >
      {({ closePopover }) => (
        <div className={styles.userProfileHeader__popOver__container}>
          {unFollowUserButton({
            userId,
            onClickButton: closePopover,
          })}
        </div>
      )}
    </Popover>
  );

  const isShowPendingButton =
    currentUserId && user && currentUserId !== user.userId && followStatus === 'pending';
  const isShowFollowButton =
    isVisitorOrBot ||
    (currentUserId && user && currentUserId !== user.userId && followStatus === 'none');
  const isShowFollowingButton =
    currentUserId && user && currentUserId !== user.userId && followStatus === 'accepted';

  const isShowUnBlockButton =
    currentUserId && user && currentUserId !== user.userId && followStatus === 'blocked';

  if (!user) return <UserProfileHeaderSkeleton />;

  return (
    <div
      className={styles.userProfileHeader__container}
      style={themeStyles}
      data-testid={accessibilityId}
    >
      <div className={styles.userProfileHeader__header}>
        <UserAvatar
          userId={user.userId}
          userData={user}
          className={styles.userProfileHeader__avatar}
          textPlaceholderClassName={styles.userProfileHeader__avatar__placeholder}
          pageId={pageId}
          componentId={componentId}
          onPressAvatar={() => setIsImageViewerOpen(true)}
        />
        <div
          ref={displayNameRef}
          className={`${styles.userProfileHeader__displayName} ${
            isMultiLine ? styles['userProfileHeader__displayName--multiLine'] : ''
          }`}
        >
          <UserName
            name={user.displayName ?? user.userId}
            pageId={pageId}
            componentId={componentId}
          />
          {user.isBrand && (
            <div className={styles.userProfileHeader__badge__container}>
              <UserOfficialBadge className={styles.userProfileHeader__badge} />
            </div>
          )}
        </div>
      </div>

      <UserDescription description={user.description} pageId={pageId} componentId={componentId} />

      <div className={styles.userProfileHeader__relationship}>
        <UserFollowing
          isCurrentUser={user.userId === currentUserId}
          userId={user.userId}
          pageId={pageId}
          componentId={componentId}
          followStatus={followStatus}
        />
        <div className={styles.userProfileHeader__relationship__separator}></div>
        <UserFollower
          isCurrentUser={user.userId === currentUserId}
          userId={user.userId}
          pageId={pageId}
          componentId={componentId}
          followStatus={followStatus}
        />
      </div>
      {pendingCount > 0 && (
        <Button
          variant="outlined"
          className={styles.pendingCountButton}
          onPress={() => AmityUserProfileHeaderComponentBehavior?.goToPendingFollowRequestPage?.()}
        >
          <div className={styles.pendingCountButton__inner}>
            <div className={styles.pendingCountButton__notification}>
              <NotificationIndicator className={styles.pendingCountButton__notification__icon} />
              <Typography.BodyBold className={styles.pendingCountButton__notification__text}>
                New follow requests
              </Typography.BodyBold>
            </div>
            <div>
              <Typography.Caption
                className={styles.pendingCountButton__notification__requestCount}
              >{`${pendingCount} request${pendingCount > 0 ? 's' : ''} need your approval`}</Typography.Caption>
            </div>
          </div>
        </Button>
      )}

      {isShowFollowButton && (
        <FollowUserButton
          pageId={pageId}
          componentId={componentId}
          onClick={() =>
            handleUserProfileBehavior({
              allowNonFollower: true,
              defaultBehavior: () => {
                if (!online) {
                  notification.info({
                    content: 'Oops, something went wrong.',
                  });
                  return;
                }
                followUser(user.userId);
              },
            })
          }
        />
      )}

      {isShowFollowingButton && renderFollowingButton(user.userId)}

      {isShowPendingButton && (
        <PendingUserButton
          pageId={pageId}
          componentId={componentId}
          onClick={() => {
            if (!online) {
              notification.info({
                content: 'Oops, something went wrong.',
              });
              return;
            }
            cancelFollow(user.userId);
          }}
        />
      )}

      {isShowUnBlockButton && (
        <UnblockUserButton
          pageId={pageId}
          componentId={componentId}
          onClick={() => {
            if (!online) {
              notification.info({
                content: 'Failed to unblock user. Please try again.',
              });
              return;
            }
            unblockUser({
              pageId,
              componentId,
              userId: user.userId,
              displayName: user.displayName ?? user.userId,
            });
          }}
        />
      )}

      {isImageViewerOpen && user.avatar && (
        <FileImageViewer
          file={user.avatar}
          onClose={() => setIsImageViewerOpen(false)}
          pageId={pageId}
          componentId={componentId}
        />
      )}
    </div>
  );
};
