import React from 'react';
import useImage from '~/core/hooks/useImage';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityAvatar.module.css';

const CommunityAvatarSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    className={styles.communityAvatar__placeholder}
    {...props}
  >
    <rect width="64" height="64" rx="32" className={styles.communityAvatar__placeholder__rect} />
    <path
      d="M31.7539 19.2C33.2201 19.2 34.6262 19.7696 35.6629 20.7836C36.6997 21.7976 37.2821 23.1728 37.2821 24.6068C37.2821 26.0408 36.6997 27.4161 35.6629 28.4301C34.6262 29.4441 33.2201 30.0137 31.7539 30.0137C30.2877 30.0137 28.8816 29.4441 27.8449 28.4301C26.8081 27.4161 26.2257 26.0408 26.2257 24.6068C26.2257 23.1728 26.8081 21.7976 27.8449 20.7836C28.8816 19.7696 30.2877 19.2 31.7539 19.2ZM20.6975 23.062C21.582 23.062 22.4033 23.2937 23.1141 23.7108C22.8772 25.92 23.5406 28.1136 24.8989 29.8284C24.1092 31.3114 22.5297 32.331 20.6975 32.331C19.4408 32.331 18.2355 31.8427 17.3469 30.9736C16.4583 30.1044 15.959 28.9256 15.959 27.6965C15.959 26.4674 16.4583 25.2886 17.3469 24.4194C18.2355 23.5503 19.4408 23.062 20.6975 23.062ZM42.8103 23.062C44.067 23.062 45.2723 23.5503 46.1609 24.4194C47.0495 25.2886 47.5488 26.4674 47.5488 27.6965C47.5488 28.9256 47.0495 30.1044 46.1609 30.9736C45.2723 31.8427 44.067 32.331 42.8103 32.331C40.9781 32.331 39.3986 31.3114 38.6089 29.8284C39.9672 28.1136 40.6306 25.92 40.3937 23.7108C41.1045 23.2937 41.9258 23.062 42.8103 23.062ZM21.4872 38.8965C21.4872 35.6987 26.0835 33.1034 31.7539 33.1034C37.4243 33.1034 42.0206 35.6987 42.0206 38.8965V41.5999H21.4872V38.8965ZM12.8 41.5999V39.2827C12.8 37.1354 15.7853 35.3279 19.8288 34.8027C18.8969 35.8532 18.3283 37.3053 18.3283 38.8965V41.5999H12.8ZM50.7077 41.5999H45.1795V38.8965C45.1795 37.3053 44.6109 35.8532 43.679 34.8027C47.7225 35.3279 50.7077 37.1354 50.7077 39.2827V41.5999Z"
      className={styles.communityAvatar__placeholder__path}
    />
  </svg>
);

export interface CommunityAvatarProps {
  pageId?: string;
  componentId?: string;
  community?: Amity.Community | null;
}

export function CommunityAvatar({
  pageId = '*',
  componentId = '*',
  community,
}: CommunityAvatarProps) {
  const elementId = 'community_avatar';
  const { accessibilityId, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const avatarFile = useImage({ fileId: community?.avatarFileId });

  if (isExcluded) return null;

  if (avatarFile == null) return <CommunityAvatarSvg style={themeStyles} />;

  return (
    <object
      data={avatarFile}
      type="image/png"
      className={styles.communityAvatar__image}
      data-qa-anchor={accessibilityId}
      style={themeStyles}
    >
      <CommunityAvatarSvg />
    </object>
  );
}
