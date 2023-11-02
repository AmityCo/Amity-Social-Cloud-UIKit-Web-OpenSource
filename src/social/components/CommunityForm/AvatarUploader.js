import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { ImageSize, FileRepository } from '@amityco/js-sdk';

import Loader from '~/core/components/Uploaders/Loader';
import Uploader from '~/core/components/Uploaders/Uploader';
import UploaderImage from '~/core/components/Uploaders/Image';
// import { backgroundImage as communityCoverPlaceholder } from '~/icons/CommunityCoverPicture';
import CameraIcon from '~/icons/Camera';

const communityCoverPlaceholder =
  'https://www.realm-global.com/wp-content/uploads/2023/06/REALMLogo.webp';

const StyledCameraIcon = styled(CameraIcon)`
  z-index: 3;
  fill: #fff;
`;

const AvatarUploadContainer = styled.div`
  background: ${({ theme }) => theme.palette.base.shade3};
  border-radius: 4px;
  position: relative;
  display: block;
  width: 100%;
  height: 16.875rem;
  overflow: hidden;
  align-self: center;
  transition: background 0.2s linear;
`;

const AvatarUploadButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  display: flex;
  background: transparent;
  border: 1px solid #ffffff;
  padding: 10px 16px;
  border-radius: 4px;
  color: #ffffff;
`;

const CoverImageLoader = styled(Loader)`
  display: inline-block;
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 0;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const BgImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`;

const ImageRenderer = ({ uploading, uploaded, progress }) => {
  const file = [...uploading, ...uploaded].sort((a, b) => b.updatedAt - a.updatedAt)[0];

  if (!file?.fileId)
    return <UploaderImage key={file?.name} file={file} progress={progress[file?.name]} />;

  const { fileId } = file;
  return <UploaderImage key={fileId} fileId={fileId} />;
};

const AvatarUploader = ({
  'data-qa-anchor': dataQaAnchor = '',
  mimeType,
  onChange,
  value: avatarFileId,
}) => {
  const [loadedAvatar, setLoadedAvatar] = useState([]);

  const handleChange = (files) => {
    const file = files[files.length - 1];
    file?.fileId && onChange(file.fileId);
  };

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = useMemo(
    () =>
      avatarFileId &&
      FileRepository.getFileUrlById({
        fileId: avatarFileId,
        imageSize: ImageSize.Medium,
      }),
    [avatarFileId],
  );

  return (
    <AvatarUploadContainer>
      <Uploader files={loadedAvatar} onChange={handleChange}>
        <ImageRenderer />
      </Uploader>
      <BgImage src={fileUrl ?? communityCoverPlaceholder} />
      <CoverImageLoader
        data-qa-anchor={`${dataQaAnchor}-avatar-uploader`}
        mimeType={mimeType}
        onChange={(newAvatar) => setLoadedAvatar(newAvatar)}
      >
        <AvatarUploadButton>
          <StyledCameraIcon width={20} height={20} /> &nbsp; Upload image
        </AvatarUploadButton>
      </CoverImageLoader>
    </AvatarUploadContainer>
  );
};

export default AvatarUploader;
