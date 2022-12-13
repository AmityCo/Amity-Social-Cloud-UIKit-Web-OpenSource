import React from 'react';
import { ImageSize, FileRepository } from '@amityco/js-sdk';
import UiKitAvatar from '~/core/components/Avatar';
import { SIZE_ALIAS } from '~/core/hocs/withSize';

const UserAvatar = ({
  size = SIZE_ALIAS.REGULAR,
  avatarCustomUrl,
  avatarUrl,
  avatarFileId,
  avatarFile,
  defaultImage,
}) => {
  const getAvatarProps = () => {
    if (avatarUrl) return { avatar: avatarUrl };
    if (avatarCustomUrl) return { avatar: avatarCustomUrl };
    if (avatarFile) return { avatar: avatarFile };
    if (avatarFileId) {
      return {
        avatar: FileRepository.getFileUrlById({
          fileId: avatarFileId,
          imageSize: ImageSize.Small,
        }),
      };
    }

    if (defaultImage) return { backgroundImage: defaultImage };

    return {};
  };

  return <UiKitAvatar size={size} {...getAvatarProps()} />;
};

export default UserAvatar;
