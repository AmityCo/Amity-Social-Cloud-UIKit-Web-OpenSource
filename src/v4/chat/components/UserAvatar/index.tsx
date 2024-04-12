import React, { useEffect, useState } from 'react';
import { FileRepository } from '@amityco/ts-sdk';
import UiKitAvatar from '~/core/components/Avatar';
import { SIZE_ALIAS } from '~/core/hocs/withSize';

export interface UserAvatarProps {
  size?: typeof SIZE_ALIAS[keyof typeof SIZE_ALIAS] | null;
  avatarUrl?: string | null;
  avatarFileId?: string | null;
  avatarFile?: File | null;
  defaultImage?: string | null;
  avatarCustomUrl?: string | null;
}

const UserAvatar = ({
  size = SIZE_ALIAS.REGULAR,
  avatarUrl,
  avatarFileId,
  avatarFile,
  defaultImage,
  avatarCustomUrl,
}: UserAvatarProps) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    setAvatar(null);
    setBackgroundImage(null);
    const getAvatarProps = async () => {
      if (avatarUrl) {
        setAvatar(avatarUrl);
        return;
      }
      if (avatarCustomUrl) {
        setAvatar(avatarCustomUrl);
        return;
      }
      if (avatarFile) {
        const toBase64 = (file: File) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
          });

        const fileBase64 = await toBase64(avatarFile);
        setAvatar(fileBase64);
        return;
      }
      if (avatarFileId) {
        const avatarFileUrl = await FileRepository.fileUrlWithSize(avatarFileId, 'small');
        setAvatar(avatarFileUrl);
        return;
      }

      if (defaultImage) {
        setBackgroundImage(defaultImage);
        return;
      }
    };
    getAvatarProps();
  }, [avatarUrl, avatarFileId, avatarFile, avatarCustomUrl]);

  return <UiKitAvatar size={size} avatar={avatar} backgroundImage={backgroundImage} />;
};

export default UserAvatar;
