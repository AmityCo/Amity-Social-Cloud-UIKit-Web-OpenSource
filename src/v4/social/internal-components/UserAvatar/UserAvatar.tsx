import clsx from 'clsx';
import React from 'react';
import useImage from '~/core/hooks/useImage';
import useUser from '~/core/hooks/useUser';
import styles from './UserAvatar.module.css';

const UserSvg = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    className={clsx(styles.userAvatar__placeholder, className)}
    {...props}
  >
    <rect width="64" height="64" rx="32" className={styles.userAvatar__placeholder__rect} />
    <path
      d="M37.0007 21.0099C35.8159 19.851 34.2089 19.2 32.5333 19.2C30.8576 19.2 29.2506 19.851 28.0658 21.0099C26.881 22.1687 26.2153 23.7405 26.2153 25.3793C26.2153 27.0182 26.881 28.5899 28.0658 29.7488C29.2506 30.9076 30.8576 31.5586 32.5333 31.5586C34.2089 31.5586 35.8159 30.9076 37.0007 29.7488C38.1856 28.5899 38.8512 27.0182 38.8512 25.3793C38.8512 23.7405 38.1856 22.1687 37.0007 21.0099Z"
      className={styles.userAvatar__placeholder__path}
    />
    <path
      d="M32.5333 35.0897C26.0529 35.0897 20.7999 38.0557 20.7999 41.7104V44.8H44.2666V41.7104C44.2666 38.0557 39.0137 35.0897 32.5333 35.0897Z"
      className={styles.userAvatar__placeholder__path}
    />
  </svg>
);

interface UserAvatarProps {
  userId?: string | null;
  className?: string;
}

export function UserAvatar({ userId, className }: UserAvatarProps) {
  const user = useUser(userId);

  const userImage = useImage({ fileId: user?.avatar?.fileId });

  if (user == null || userId == null || userImage == null) return <UserSvg className={className} />;

  return (
    <object data={userImage} type="image/png" className={clsx(styles.userAvatar__img, className)}>
      <UserSvg className={className} />
    </object>
  );
}
