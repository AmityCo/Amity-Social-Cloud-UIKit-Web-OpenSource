import React, { ReactNode, useEffect } from 'react';

import { useUser } from '~/v4/core/hooks/objects/useUser';
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
  const { user, refresh } = useUser({ userId });
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  useEffect(() => {
    refresh();
  }, []);

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
