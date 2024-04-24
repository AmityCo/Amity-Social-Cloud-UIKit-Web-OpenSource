import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import OptionMenu from '~/core/components/OptionMenu';
import UserHeader from '~/social/components/UserHeader';
import useUser from '~/core/hooks/useUser';
import { MemberInfo, CommunityMemberContainer } from './styles';
import { isModerator } from '~/helpers/permissions';
import { MemberRoles } from '~/social/constants';
import { isNonNullable } from '~/helpers/utils';
import useUserFlaggedByMe from '~/social/hooks/useUserFlaggedByMe';
import useUserSubscription from '~/social/hooks/useUserSubscription';
import { SubscriptionLevels } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';
import { useNotifications } from '~/core/providers/NotificationProvider';

const { COMMUNITY_MODERATOR, CHANNEL_MODERATOR } = MemberRoles;

interface CommunityMemberItemProps {
  userId: string;
  currentUserId: string;
  assignRolesToUsers: (roles: string[], userIds: string[]) => void;
  hasModeratorPermissions: boolean;
  removeRolesFromUsers: (roles: string[], userIds: string[]) => void;
  removeMembers: (userIds: string[]) => void;
  roles: string[];
  isJoined?: boolean;
  isBanned?: boolean;
  onClick: (userId?: string | null) => void;
}

const CommunityMemberItem = ({
  userId,
  currentUserId,
  onClick,
  roles = [],
  assignRolesToUsers,
  hasModeratorPermissions,
  removeRolesFromUsers,
  removeMembers,
  isJoined,
  isBanned,
}: CommunityMemberItemProps) => {
  const user = useUser(userId);
  const { formatMessage } = useIntl();
  const { isFlaggedByMe, toggleFlagUser } = useUserFlaggedByMe(userId);
  const isGlobalBanned = user?.isGlobalBanned;
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  useUserSubscription({
    userId,
    level: SubscriptionLevels.USER,
  });

  const handleReport = async () => {
    return toggleFlagUser();
  };

  const onReportClick = () => {
    handleReport();
    notification.success({
      content: <FormattedMessage id="report.reportSent" />,
    });
  };

  const onPromoteModeratorClick = () =>
    assignRolesToUsers([COMMUNITY_MODERATOR, CHANNEL_MODERATOR], [userId]);
  const onDismissModeratorClick = () =>
    removeRolesFromUsers([COMMUNITY_MODERATOR, CHANNEL_MODERATOR], [userId]);

  const onRemoveFromCommunityClick = () => {
    confirm({
      'data-qa-anchor': 'remove-user',
      title: <FormattedMessage id="community.removeUserFromCommunityTitle" />,
      content: <FormattedMessage id="community.removeUserFromCommunityBody" />,
      cancelText: 'Cancel',
      okText: 'Remove',
      onOk: () => removeMembers([userId]),
    });
  };

  const memberHasModeratorRole = isModerator(roles);
  const isCurrentUser = currentUserId === userId;

  return (
    <CommunityMemberContainer data-qa-anchor="community-member-item">
      <MemberInfo>
        <UserHeader userId={userId} isBanned={isBanned || isGlobalBanned} onClick={onClick} />
      </MemberInfo>

      {!isCurrentUser && isJoined && (
        <OptionMenu
          data-qa-anchor="community-members-option-menu"
          options={[
            {
              name: isFlaggedByMe
                ? formatMessage({ id: 'report.unreportUser' })
                : formatMessage({ id: 'report.reportUser' }),
              action: onReportClick,
            },
            hasModeratorPermissions && !memberHasModeratorRole && !isGlobalBanned
              ? {
                  name: formatMessage({ id: 'moderatorMenu.promoteToModerator' }),
                  action: onPromoteModeratorClick,
                }
              : null,
            hasModeratorPermissions && memberHasModeratorRole
              ? {
                  name: formatMessage({ id: 'moderatorMenu.dismissModerator' }),
                  action: onDismissModeratorClick,
                }
              : null,
            hasModeratorPermissions
              ? {
                  name: formatMessage({ id: 'moderatorMenu.removeFromCommunity' }),
                  action: onRemoveFromCommunityClick,
                  className: 'danger-zone',
                }
              : null,
          ].filter(isNonNullable)}
        />
      )}
    </CommunityMemberContainer>
  );
};

export default CommunityMemberItem;
