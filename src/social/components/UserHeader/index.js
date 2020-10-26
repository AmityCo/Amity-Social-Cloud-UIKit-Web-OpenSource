import React from 'react';
import PropTypes from 'prop-types';

import useUser from '~/core/hooks/useUser';

import UIUserHeader from './styles';

const UserHeader = ({ userId, children, onClick }) => {
  const { user, file } = useUser(userId);

  return (
    <UIUserHeader
      userId={user.userId}
      displayName={user.displayName}
      avatarFileUrl={file.fileUrl}
      onClick={onClick}
    >
      {children}
    </UIUserHeader>
  );
};

UserHeader.propTypes = {
  userId: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

UserHeader.defaultProps = {
  children: null,
  onClick: () => {},
};

export default UserHeader;
