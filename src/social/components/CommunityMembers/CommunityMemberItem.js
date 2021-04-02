import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { notification } from '~/core/components/Notification';
import OptionMenu from '~/core/components/OptionMenu';
import UserHeader from '~/social/components/UserHeader';
import useUser from '~/core/hooks/useUser';
import ConditionalRender from '~/core/components/ConditionalRender';
import { MemberInfo, CommunityMemberContainer } from './styles';
import { confirm } from '~/core/components/Confirm';

const MODERATOR_ROLE = 'moderator';

const CommunityMemberItem = ({
  userId,
  currentUserId,
  onClick,
  roles,
  assignRoleToUsers,
  hasModeratorPermissions,
  removeRoleFromUsers,
  removeMembers,
  isJoined,
}) => {
  const { handleReportUser, isFlaggedByMe } = useUser(userId);

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

  const isCurrentUser = currentUserId === userId;

  return (
    <CommunityMemberContainer>
      <MemberInfo>
        <UserHeader userId={userId} onClick={onClick} />
      </MemberInfo>
      <ConditionalRender condition={!isCurrentUser && isJoined}>
        <OptionMenu
          options={[
            {
              name: isFlaggedByMe ? 'report.undoReport' : 'report.doReport',
              action: onReportClick,
            },
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
      </ConditionalRender>
    </CommunityMemberContainer>
  );
};

CommunityMemberItem.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  assignRoleToUsers: PropTypes.func,
  hasModeratorPermissions: PropTypes.bool,
  removeRoleFromUsers: PropTypes.func,
  removeMembers: PropTypes.func,
  roles: PropTypes.arrayOf(PropTypes.string),
  isJoined: PropTypes.bool,
};

export default CommunityMemberItem;
