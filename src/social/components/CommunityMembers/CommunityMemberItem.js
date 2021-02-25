import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { notification } from '~/core/components/Notification';
import OptionMenu from '~/core/components/OptionMenu';
import UserHeader from '~/social/components/UserHeader';
import useUser from '~/core/hooks/useUser';
import { MemberInfo, CommunityMemberContainer } from './styles';
import { confirm } from '~/core/components/Confirm';

const MODERATOR_ROLE = 'moderator';

const CommunityMemberItem = ({
  userId,
  onClick,
  roles,
  assignRoleToUsers,
  hasModeratorPermissions,
  removeRoleFromUsers,
  removeMembers,
}) => {
  const { handleReportUser } = useUser(userId);

  const onReportClick = () => {
    handleReportUser();
    notification.success({
      content: <FormattedMessage id="report.reportSent" />,
    });
  };

  const onPromoteModeratorClick = () => assignRoleToUsers(MODERATOR_ROLE, [userId]);

  const onDismissModeratorClick = () => removeRoleFromUsers(MODERATOR_ROLE, [userId]);

  const onRemoveFromCommunityClick = () => {
    confirm({
      title: <FormattedMessage id="community.removeUserFromCommunityTitle" />,
      content: <FormattedMessage id="community.removeUserFromCommunityBody" />,
      cancelText: 'Cancel',
      okText: 'Remove',
      onOk: () => removeMembers([userId]),
    });
  };

  const memberHasModeratorRole = roles.includes(MODERATOR_ROLE);

  return (
    <CommunityMemberContainer>
      <MemberInfo>
        <UserHeader userId={userId} onClick={onClick} />
      </MemberInfo>
      <OptionMenu
        options={[
          { name: 'report.reportUser', action: onReportClick },
          hasModeratorPermissions &&
            !memberHasModeratorRole && {
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
    </CommunityMemberContainer>
  );
};

CommunityMemberItem.propTypes = {
  userId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  assignRoleToUsers: PropTypes.func,
  hasModeratorPermissions: PropTypes.bool,
  removeRoleFromUsers: PropTypes.func,
  removeMembers: PropTypes.func,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default CommunityMemberItem;
