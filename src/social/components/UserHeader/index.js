import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import useUser from '~/core/hooks/useUser';

import UIUserHeader from './styles';

function formatDisplayName(user, presetDisplayName) {
  if (user.displayName && user.displayName !== user.userId) {
    return user.displayName;
  }

  return presetDisplayName;
}

const UserHeader = ({
  userId,
  children,
  onClick,
  isBanned,
  showId,
  displayName,
  isLoading,
  showName = true,
}) => {
  const { user, file } = useUser(userId, [userId]);
  const { formatMessage } = useIntl();

  return (
    <UIUserHeader
      showId={showId}
      showName={showName}
      userId={user.userId}
      displayName={formatDisplayName(user, displayName ?? formatMessage({ id: 'userType.noomer' }))}
      avatarFileUrl={file.fileUrl}
      isBanned={isBanned || user.isGlobalBan}
      onClick={onClick}
      isLoading={isLoading !== false && !user.createdAt}
    >
      {children}
    </UIUserHeader>
  );
};

UserHeader.propTypes = {
  showId: PropTypes.bool,
  userId: PropTypes.string.isRequired,
  children: PropTypes.node,
  isBanned: PropTypes.bool,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  displayName: PropTypes.string,
};

UserHeader.defaultProps = {
  children: null,
  onClick: () => {},
};

export default UserHeader;
