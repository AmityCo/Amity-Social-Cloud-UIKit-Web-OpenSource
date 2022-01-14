import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { notification } from '~/core/components/Notification';
import OptionMenu from '~/core/components/OptionMenu';
import UserHeader from '~/social/components/UserHeader';
import useUser from '~/core/hooks/useUser';
import ConditionalRender from '~/core/components/ConditionalRender';
import useReport from '~/social/hooks/useReport';
import { MemberInfo, CommunityMemberContainer } from './styles';
import { confirm } from '~/core/components/Confirm';
import { isModerator } from '~/helpers/permissions';
import { MemberRoles } from '~/social/constants';

const { COMMUNITY_MODERATOR, CHANNEL_MODERATOR } = MemberRoles;

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
}) => {
  const { user } = useUser(userId);
  const { isFlaggedByMe, handleReport } = useReport(user);
  const isGlobalBan = user?.isGlobalBan;

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
    <CommunityMemberContainer>
      <MemberInfo>
        <UserHeader userId={userId} isBanned={isBanned || isGlobalBan} onClick={onClick} />
      </MemberInfo>
      <ConditionalRender condition={!isCurrentUser && isJoined}>
        <OptionMenu
          options={[
            {
              name: isFlaggedByMe ? 'report.unreportUser' : 'report.reportUser',
              action: onReportClick,
            },
            hasModeratorPermissions &&
              !memberHasModeratorRole &&
              !isGlobalBan && {
                name: 'moderatorMenu.promoteToModerator',
                action: onPromoteModeratorClick,
              },
            hasModeratorPermissions &&
              memberHasModeratorRole && {
                name: 'moderatorMenu.dismissModerator',
                action: onDismissModeratorClick,
              },
            hasModeratorPermissions && {
              name: 'moderatorMenu.removeFromCommunity',
              action: onRemoveFromCommunityClick,
              className: 'danger-zone',
            },
          ].filter(Boolean)}
        />
      </ConditionalRender>
    </CommunityMemberContainer>
  );
};

CommunityMemberItem.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  assignRolesToUsers: PropTypes.func,
  hasModeratorPermissions: PropTypes.bool,
  removeRolesFromUsers: PropTypes.func,
  removeMembers: PropTypes.func,
  roles: PropTypes.arrayOf(PropTypes.string),
  isJoined: PropTypes.bool,
  isBanned: PropTypes.bool,
  onClick: PropTypes.func,
};

export default CommunityMemberItem;
