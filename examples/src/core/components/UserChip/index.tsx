import React from 'react';

import useUser from '~/core/hooks/useUser';

import UIUserChip from './UIUserChip';
import useImage from '~/core/hooks/useImage';

interface UserChipProps {
  userId: string;
  onClick?: (userId: string) => void;
  onRemove?: (userId: string) => void;
}

const UserChip = ({ userId, onClick, onRemove }: UserChipProps) => {
  const user = useUser(userId);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  if (user == null) return null;

  return (
    <UIUserChip
      userId={user.userId}
      displayName={user.displayName}
      fileUrl={avatarFileUrl}
      onClick={(userId: string) => onClick?.(userId)}
      onRemove={onRemove}
    />
  );
};

export default UserChip;
