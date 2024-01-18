import React from 'react';
import PropTypes from 'prop-types';

import useUser from '~/core/hooks/useUser';

import UIUserHeader from './styles';

const UserHeader = ({ userId, children, onClick, isBanned }) => {
  const { user, file } = useUser(userId, [userId]);

  return (
    <UIUserHeader
      userId={user.userId}
      displayName={user.displayName}
      avatarFileUrl={file.fileUrl}
      isBanned={isBanned || user.isGlobalBan}
      onClick={onClick}
    >
      {children}
    </UIUserHeader>
  );
};

UserHeader.propTypes = {
  userId: PropTypes.string.isRequired,
  children: PropTypes.node,
  isBanned: PropTypes.bool,
  onClick: PropTypes.func,
};

UserHeader.defaultProps = {
  children: null,
  onClick: () => {},
};

export default UserHeader;
