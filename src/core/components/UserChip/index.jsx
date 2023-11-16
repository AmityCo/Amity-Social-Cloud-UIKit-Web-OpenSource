import React from 'react';

import useUser from '~/core/hooks/useUser';

import StyledUserChip from './styles';

const UserChip = ({ userId, onClick, onRemove }) => {
  const { user, file } = useUser(userId);

  return (
    <StyledUserChip
      userId={userId}
      displayName={user.displayName}
      fileUrl={file.fileUrl}
      onClick={onClick}
      onRemove={onRemove}
    />
  );
};

export default UserChip;
