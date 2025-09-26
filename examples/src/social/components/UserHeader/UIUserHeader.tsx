import React, { ReactNode } from 'react';
import BanIcon from '~/icons/Ban';
import { backgroundImage as userHeaderBackgroundImage } from '~/icons/User';

import {
  UserHeaderAvatar,
  UserHeaderContainer,
  UserHeaderSubtitle,
  UserHeaderTitle,
} from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge/BrandBadge';

interface UIUserHeaderProps {
  userId?: string | null;
  displayName?: string | null;
  avatarFileUrl?: string | null;
  children?: ReactNode;
  isBanned?: boolean;
  isBrand?: boolean;
  onClick?: (userId: string) => void;
}

const UIUserHeader = ({
  userId,
  displayName,
  avatarFileUrl,
  children,
  onClick,
  isBanned,
  isBrand,
}: UIUserHeaderProps) => {
  const onClickUser = () => userId && onClick?.(userId);
  return (
    <UserHeaderContainer noSubtitle={!!children}>
      <UserHeaderAvatar
        avatar={avatarFileUrl}
        backgroundImage={userHeaderBackgroundImage}
        onClick={onClickUser}
      />
      <UserHeaderTitle title={userId || undefined} onClick={onClickUser}>
        <div>{displayName}</div> {isBanned && <BanIcon />} {isBrand && <BrandBadge />}
      </UserHeaderTitle>
      {children && <UserHeaderSubtitle>{children}</UserHeaderSubtitle>}
    </UserHeaderContainer>
  );
};

export default (props: UIUserHeaderProps) => {
  const CustomComponentFn = useCustomComponent<UIUserHeaderProps>('UserHeader');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UIUserHeader {...props} />;
};
