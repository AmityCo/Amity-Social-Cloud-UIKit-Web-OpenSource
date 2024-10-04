import React, { ReactNode } from 'react';

import useUser from '~/core/hooks/useUser';
import useFile from '~/core/hooks/useFile';
import UIUserHeader from './UIUserHeader';
import useImage from '~/core/hooks/useImage';

interface UserHeaderProps {
  userId?: string | null;
  children?: ReactNode;
  isBanned?: boolean;
  onClick?: (userId?: string | null) => void;
}

const UserHeader = ({ userId, children, onClick, isBanned = false }: UserHeaderProps) => {
  const user = useUser(userId);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  return (
    <UIUserHeader
      userId={user?.userId}
      displayName={user?.displayName}
      avatarFileUrl={avatarFileUrl}
      isBanned={isBanned}
      isBrand={user?.isBrand}
      onClick={onClick}
    >
      {children}
    </UIUserHeader>
  );
};

export default UserHeader;
