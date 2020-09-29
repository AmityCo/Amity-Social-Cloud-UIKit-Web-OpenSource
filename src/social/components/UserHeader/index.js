import React from 'react';
import PropTypes from 'prop-types';

import useUser from '~/core/hooks/useUser';
import StyledUserHeader from './UserHeader.styles';

const UserHeader = ({ userId, children, onClick }) => {
  const { user, file } = useUser(userId);

  return (
    <StyledUserHeader
      userId={user.userId}
      displayName={user.displayName}
      avatarFileUrl={file.fileUrl}
      onClick={onClick}
    >
      {children}
    </StyledUserHeader>
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
