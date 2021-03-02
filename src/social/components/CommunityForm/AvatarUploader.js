import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { EkoImageSize, FileRepository } from 'eko-sdk';

import Loader from '~/core/components/Uploaders/Loader';
import Uploader from '~/core/components/Uploaders/Uploader';
import Image from '~/core/components/Uploaders/Image';
import CameraIcon from '~/icons/Camera';
import Avatar from '~/core/components/Avatar';

const StyledCameraIcon = styled(CameraIcon)`
  font-size: 20px;
  z-index: 3;
  position: absolute;
  left: 22px;
  top: 20px;
  cursor: pointer;
  color: #fff;
`;

const UploadOverlay = styled.div`
  background: rgba(0, 0, 0, 0);
  top: 0;
  left: 0;
  z-index: 1;
  transition: background 0.3s;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  pointer-events: none;
`;

const AvatarUploadContainer = styled.div`
  background: ${({ theme }) => theme.palette.base.shade3};
  position: relative;
  display: block;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  overflow: hidden;
  align-self: center;
  &:hover ${UploadOverlay} {
    background: rgba(0, 0, 0, 0.5);
  }
`;

const AvatarImageLoader = styled(Loader)`
  display: inline-block;
  width: 100%;
  height: 100%;
`;

const ImageRenderer = ({ uploading, uploaded, progress }) => {
  const allFiles = [...uploading, ...uploaded];

  return allFiles.map(file => {
    if (!file?.fileId)
      return <Image key={file?.name} file={file} progress={progress[file?.name]} />;

    const { fileId } = file;
    return <Image key={fileId} fileId={fileId} />;
  });
};

const AvatarUploader = ({ mimeType, onChange, value: avatarFileId }) => {
  const [loadedAvatar, setLoadedAvatar] = useState([]);

  const handleChange = files => {
    const file = files[files.length - 1];
    file?.fileId && onChange(file.fileId);
  };

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = useMemo(
    () =>
      avatarFileId &&
      FileRepository.getFileUrlById({
        fileId: avatarFileId,
        imageSize: EkoImageSize.Medium,
      }),
    [avatarFileId],
  );

  return (
    <AvatarUploadContainer>
      <AvatarImageLoader mimeType={mimeType} onChange={newAvatar => setLoadedAvatar(newAvatar)}>
        <Uploader files={loadedAvatar} onChange={handleChange}>
          <ImageRenderer />
        </Uploader>
        <UploadOverlay>
          <StyledCameraIcon />
          <Avatar avatar={fileUrl} size="big" backgroundImage={null} showOverlay />
        </UploadOverlay>
      </AvatarImageLoader>
    </AvatarUploadContainer>
  );
};

export default AvatarUploader;
