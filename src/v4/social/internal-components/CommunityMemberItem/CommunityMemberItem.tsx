import React from 'react';
import styles from './CommunityMemberItem.module.css';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { Typography } from '~/v4/core/components';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { Button } from '~/v4/core/natives/Button/Button';
import { PromoteToModerator } from '~/v4/icons/PromoteToModerator';
import { DemoteToMember } from '~/v4/icons/DemoteToMember';
import useModerator from '~/v4/social/hooks/useModerator';
import useUserFlaggedByMe from '~/v4/social/hooks/useUserFlaggedByMe';
import { MemberRoles } from '~/v4/social/constants/memberRoles';
import { isModerator } from '~/v4/utils/permissions';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import UnFlag from '~/v4/icons/UnFlag';
import Flag from '~/v4/icons/Flag';
import { isNonNullable } from '~/v4/helpers/utils';
import { IconComponent } from '~/v4/core/IconComponent';
import Banned from '~/v4/icons/Banned';
import { Popover } from '~/v4/core/components/AriaPopover';
import { TrashIcon } from '~/v4/icons/Trash';
import { useNetworkState } from 'react-use';
import { BrandBadge } from '~/v4/social/elements';

const { COMMUNITY_MODERATOR, CHANNEL_MODERATOR } = MemberRoles;

type CommunityMemberItemProps = {
  pageId?: string;
  roles?: string[];
  user?: Amity.User;
  onClick?: () => void;
  refresh?: () => void;
  isModeratorTab?: boolean;
  community?: Amity.Community;
  currentUserId?: string | null;
};

export const CommunityMemberItem = ({
  user,
  roles,
  onClick,
  refresh,
  community,
  pageId = '*',
  currentUserId,
  isModeratorTab = false,
}: CommunityMemberItemProps) => {
  const { online } = useNetworkState();
  const notification = useNotifications();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { isFlaggedByMe, toggleFlagUser } = useUserFlaggedByMe(user?.userId as string);
  const { hasModeratorPermissions, assignRolesToUsers, removeRolesFromUsers, removeMembers } =
    useModerator({
      community,
      user,
    });
  const memberHasModeratorRole = isModerator(roles);
  const isGlobalBanned = user?.isGlobalBan;
  const isCurrentUser = currentUserId === user?.userId;

  const onReportMember = async () => {
    removeDrawerData();

    if (!online) {
      notification.info({
        content: `Failed to ${isFlaggedByMe ? 'unreport' : 'report'} member. Please try again.`,
      });
      return;
    }

    try {
      await toggleFlagUser();
      notification.success({ content: isFlaggedByMe ? 'Member unreported.' : 'Member reported.' });
    } catch (err) {
      notification.info({ content: 'Failed to report member. Please try again.' });
    }
  };

  const onPromoteModeratorClick = async () => {
    removeDrawerData();

    if (!online) {
      notification.info({ content: 'Failed to promote member. Please try again.' });
      return;
    }

    try {
      await assignRolesToUsers([COMMUNITY_MODERATOR, CHANNEL_MODERATOR], [user?.userId as string]);
      setTimeout(() => {
        refresh?.();
      }, 2000); // TODO: to remove refresh function after SDK has been fixed.
      notification.success({ content: 'Successfully promoted to moderator!' });
    } catch (err) {
      notification.info({ content: 'Failed to promote member. Please try again.' });
    }
  };

  const onDismissModeratorClick = async () => {
    removeDrawerData();

    if (!online) {
      notification.info({ content: 'Failed to demote member. Please try again.' });
      return;
    }

    try {
      await removeRolesFromUsers(
        [COMMUNITY_MODERATOR, CHANNEL_MODERATOR],
        [user?.userId as string],
      );
      notification.success({ content: 'Successfully demoted to member!' });
    } catch (err) {
      notification.info({ content: 'Failed to demote member. Please try again.' });
    }
  };

  const onRemoveFromCommunityClick = async () => {
    removeDrawerData();

    if (!online) {
      notification.info({ content: 'Failed to remove member. Please try again.' });
      return;
    }

    try {
      user?.userId && (await removeMembers([user.userId]));
      notification.success({ content: 'Member removed from this community.' });
    } catch (err) {
      notification.info({ content: 'Failed to remove member. Please try again.' });
    }
  };

  const options = [
    hasModeratorPermissions && !memberHasModeratorRole && !isGlobalBanned
      ? {
          name: 'Promote to moderator',
          action: onPromoteModeratorClick,
          accessibilityId: 'promote_moderator',
          icon: <PromoteToModerator className={styles.communityMemberItem__bottomSheeticon} />,
        }
      : null,

    hasModeratorPermissions && memberHasModeratorRole
      ? {
          name: 'Demote to member',
          action: onDismissModeratorClick,
          accessibilityId: 'demote_member',
          icon: <DemoteToMember className={styles.communityMemberItem__bottomSheeticon} />,
        }
      : null,

    {
      action: onReportMember,
      accessibilityId: 'report_member',
      name: isFlaggedByMe ? 'Unreport user' : 'Report user',
      icon: isFlaggedByMe ? (
        <UnFlag className={styles.communityMemberItem__bottomSheeticon} />
      ) : (
        <Flag className={styles.communityMemberItem__bottomSheeticon} />
      ),
    },
    hasModeratorPermissions
      ? {
          name: 'Remove from community',
          accessibilityId: 'remove_member',
          action: onRemoveFromCommunityClick,
          className: styles.communityMemberItem__alertText,
          icon: <TrashIcon className={styles.communityMemberItem__alertbottomSheeticon} />,
        }
      : null,
  ].filter(isNonNullable);

  return (
    <div
      data-testid={`${pageId}/*/member-${user?.userId}`}
      className={styles.communityMemberItem}
      key={user?.userId}
    >
      <Button
        data-testid={`${pageId}/*/member-${user?.userId}`}
        onPress={onClick}
        className={styles.communityMemberItem__leftSide}
      >
        <div className={styles.communityMemberItem__memberAvatar}>
          <UserAvatar
            userId={user?.userId}
            isShowModeratorBadge={memberHasModeratorRole}
            className={styles.communityMemberItem__memberAvatar}
          />
        </div>

        <div className={styles.communityMemberItem__memberNameWrapper}>
          <Typography.BodyBold className={styles.communityMemberItem__memberName}>
            {user?.displayName}
          </Typography.BodyBold>
          {user?.isBrand && (
            <IconComponent
              defaultIconName="badge icon"
              imgIcon={() => <BrandBadge className={styles.communityMemberItem__badge} />}
              defaultIcon={() => <BrandBadge className={styles.communityMemberItem__badge} />}
            />
          )}
        </div>
        {isGlobalBanned && (
          <IconComponent
            defaultIconName="banned icon"
            imgIcon={() => <Banned className={styles.communityMemberItem__bannedIcon} />}
            defaultIcon={() => <Banned className={styles.communityMemberItem__bannedIcon} />}
          />
        )}
      </Button>
      {!isCurrentUser && community?.isJoined && (
        <Popover
          trigger={{
            pageId,
            onClick: ({ closePopover }) => {
              setDrawerData({
                content: (
                  <div className={styles.communityMemberItem__menuWrapper}>
                    {options.map((option) => (
                      <Button
                        key={option.name}
                        className={styles.communityMemberItem__menu}
                        onPress={() => {
                          closePopover();
                          option.action();
                        }}
                      >
                        <IconComponent
                          imgIcon={() => option.icon}
                          defaultIcon={() => option.icon}
                          defaultIconName={option.accessibilityId}
                        />
                        <Typography.BodyBold className={option.className ?? ''}>
                          {option.name}
                        </Typography.BodyBold>
                      </Button>
                    ))}
                  </div>
                ),
              });
            },
          }}
        >
          {({ closePopover }) => (
            <div className={styles.communityMemberItem__menuWrapper}>
              {options.map((option) => (
                <Button
                  key={option.name}
                  className={styles.communityMemberItem__menu}
                  onPress={() => {
                    closePopover();
                    option.action();
                  }}
                >
                  <IconComponent
                    imgIcon={() => option.icon}
                    defaultIcon={() => option.icon}
                    defaultIconName={option.accessibilityId}
                  />
                  <Typography.BodyBold className={option.className ?? ''}>
                    {option.name}
                  </Typography.BodyBold>
                </Button>
              ))}
            </div>
          )}
        </Popover>
      )}
    </div>
  );
};
