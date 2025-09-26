import React, { useState } from 'react';
import styles from './UserProfileHeader.module.css';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { UserFollowing } from '~/v4/social/elements/UserFollowing/UserFollowing';
import { UserFollower } from '~/v4/social/elements/UserFollower/UserFollower';
import { UserGroup } from '~/v4/social/elements/UserGroup/UserGroup';
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
import { Button } from '~/v4/core/components/AriaButton';
import { Button as CustomButton } from '~/v4/core/components/Button';
import { Typography } from '~/v4/core/components';
import NotificationIndicator from '~/v4/icons/NotificationIndicator';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import useUserFollow from '~/v4/social/hooks/useUserFollow';
import UnfollowUser from '~/v4/icons/UnfollowUser';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import useUserBlock from '~/v4/social/hooks/useUserBlock';
import { SingleImageViewer } from '~/v4/social/internal-components/SingleImageViewer';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useNetworkState } from 'react-use';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import Pencil from '~/v4/icons/Pencil';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { EditUserProfilePage } from '../../pages/EditUserProfilePage/EditUserProfilePage';
import { Title } from '../../elements';

interface UserProfileHeaderProps {
  user?: Amity.User | null;
  pageId?: string;
  userBadgeTitle?: string;
  isCurrentUser?: boolean;
  forcePublicProfileView?: boolean;
}

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
export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  pageId = '*',
  userBadgeTitle = 'Lupo Solitario',
  isCurrentUser = false,
  forcePublicProfileView,
}) => {
  const componentId = 'user_profile_header';
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const { currentUserId } = useSDK();
  const { themeStyles, accessibilityId } = useAmityComponent({ pageId, componentId });
  const { AmityUserProfileHeaderComponentBehavior } = usePageBehavior();
  const { followStatus, pendingCount } = useFollowCount(user?.userId);
  const { followUser, unFollowUser, cancelFollow } = useUserFollow();
  const { unblockUser } = useUserBlock();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { online } = useNetworkState();
  const { openPopup } = usePopupContext();
  const notification = useNotifications();
  const { AmityUserProfilePageBehavior } = usePageBehavior();
  const { isDesktop } = useResponsive();

  const onEditProfile = () => {
    if (!user?.userId) return;

    if (isDesktop) {
      openPopup({
        pageId,
        componentId,
        header: (
          <Title
            pageId="edit_user_profile_page"
            titleClassName={styles.EditUserProfilePage__title}
          />
        ),
        children: <EditUserProfilePage userId={user?.userId || ''} />,
      });
    } else {
      AmityUserProfilePageBehavior?.goToEditUserPage?.({ userId: user.userId });
    }
  };
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
    >
      <UnfollowUser className={styles.userProfileHeader__unFollowButton__icon} />
      <Typography.BodyBold className={styles.userProfileHeader__unFollowButton__text}>
        Unfollow
      </Typography.BodyBold>
    </Button>
  );

  const onClickFollowingButton = (userId: string) => {
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
            if (!isDesktop) onClickFollowingButton(userId);
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

  const renderSendMessageButton = (userId: string) => (
    <CustomButton
      className={styles.userProfileHeader__messageButton}
      onClick={() => {}}
      variant="outlined"
    >
      <div className={styles.userProfileHeader__messageButton__inner}>
        <Typography.BodyBold className={styles.userProfileHeader__messageButton__text}>
          Messaggio
        </Typography.BodyBold>
      </div>
    </CustomButton>
  );

  const isShowPendingButton =
    currentUserId &&
    user &&
    !forcePublicProfileView &&
    currentUserId !== user.userId &&
    followStatus === 'pending';

  // If forcePublicProfileView is true, always show the Follow button
  const isShowFollowButton =
    currentUserId &&
    user &&
    (forcePublicProfileView || (currentUserId !== user.userId && followStatus === 'none'));

  const isShowFollowingButton =
    currentUserId &&
    user &&
    !forcePublicProfileView &&
    currentUserId !== user.userId &&
    followStatus === 'accepted';

  const isShowUnBlockButton =
    currentUserId &&
    user &&
    !forcePublicProfileView &&
    currentUserId !== user.userId &&
    followStatus === 'blocked';

  if (!user) return <UserProfileHeaderSkeleton />;

  return (
    <div
      className={styles.userProfileHeader__container}
      style={themeStyles}
      data-testid={accessibilityId}
    >
      <div className={styles.userProfileHeader__header}>
        <div className={styles.userProfileHeader__leftWrapper}>
          <Button onPress={() => setIsImageViewerOpen(true)}>
            <UserAvatar
              userId={user.userId}
              className={styles.userProfileHeader__avatar}
              textPlaceholderClassName={styles.userProfileHeader__avatar__placeholder}
              pageId={pageId}
              componentId={componentId}
            />
          </Button>
        </div>
        <div className={styles.userProfileHeader__rightWrapper}>
          <div className={styles.userProfileHeader__displayName}>
            <div className={styles.userProfileHeader__nameRow}>
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
            {userBadgeTitle && <div className={styles.userBadge}>{userBadgeTitle}</div>}
          </div>
          {isCurrentUser && !forcePublicProfileView && (
            <Button
              data-testid={`${pageId}/'*'/edit_user_profile_button`}
              className={styles.userProfileHeader__button}
              onPress={onEditProfile}
            >
              <Pencil className={styles.userProfileHeader__editProfile__icon} />
            </Button>
          )}
          {/* {forcePublicProfileView && (
            <>
              <Button
                data-testid={`${pageId}/'*'/follow_user_button`}
                className={styles.userProfileHeader__button}
                onClick={() => followUser(user.userId)}
              >
                follow test
              </Button>
              <Button
                data-testid={`${pageId}/'*'/message_user_button`}
                className={styles.userProfileHeader__button}
                onClick={() => {}}
              >
                Messaggio test{' '}
              </Button>
            </>
          )} */}
        </div>
      </div>

      <UserDescription description={user.description} pageId={pageId} componentId={componentId} />

      <div className={styles.userProfileHeader_bottomPositioner}>
        <div className={styles.userProfileHeader__relationship}>
          <UserFollowing userId={user.userId} pageId={pageId} componentId={componentId} />
          <div className={styles.userProfileHeader__relationship__separator}></div>
          <UserFollower userId={user.userId} pageId={pageId} componentId={componentId} />
          <div className={styles.userProfileHeader__relationship__separator}></div>
          <UserGroup userId={user.userId} pageId={pageId} componentId={componentId} />
        </div>

        <div className={styles.userProfileHeader__relationshipButtons}>
          {pendingCount > 0 && (
            <Button
              variant="outlined"
              className={styles.pendingCountButton}
              onPress={() =>
                AmityUserProfileHeaderComponentBehavior?.goToPendingFollowRequestPage?.()
              }
            >
              <div className={styles.pendingCountButton__inner}>
                <div className={styles.pendingCountButton__notification}>
                  <NotificationIndicator
                    className={styles.pendingCountButton__notification__icon}
                  />
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
              onClick={() => {
                if (!online) {
                  notification.info({
                    content: 'Oops, something went wrong.',
                  });
                  return;
                }
                followUser(user.userId);
              }}
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
          {(!isCurrentUser || forcePublicProfileView) &&
            !isShowUnBlockButton &&
            renderSendMessageButton(user.userId)}
        </div>
      </div>

      {isImageViewerOpen && user.avatarFileId && (
        <SingleImageViewer
          fileId={user.avatarFileId}
          onClose={() => setIsImageViewerOpen(false)}
          pageId={pageId}
          componentId={componentId}
        />
      )}
    </div>
  );
};
