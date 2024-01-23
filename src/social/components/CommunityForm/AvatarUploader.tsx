import React, { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FileRepository } from '@amityco/ts-sdk';

import Loader from '~/core/components/Uploaders/Loader';
import UploaderImage from '~/core/components/Uploaders/Image';
import CameraIcon from '~/icons/Camera';
import useFile from '~/core/hooks/useFile';
import useFileUpload, { getUpdatedTime, isAmityFile } from '~/core/hooks/useFileUpload';

const StyledCameraIcon = styled(CameraIcon)<{ icon?: ReactNode }>`
  font-size: 20px;
  z-index: 3;
  color: #fff;
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

const BgImage = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: ${({ theme }) => theme.palette.base.shade3};
`;

interface ImageRendererProps {
  uploading: File[];
  uploaded: Amity.File[];
  progress: Record<string, number>;
}

const ImageRenderer = ({ uploading, uploaded, progress }: ImageRendererProps) => {
  const sortedFiles = [...uploading, ...uploaded].sort((a, b) => {
    const aTime = getUpdatedTime(a);
    const bTime = getUpdatedTime(b);
    return bTime - aTime;
  });

  const file = sortedFiles.length > 0 ? sortedFiles[0] : null;

  if (!file) return null;

  if (!isAmityFile(file))
    return <UploaderImage key={file?.name} file={file} progress={progress[file?.name]} />;

  const { fileId } = file;
  return <UploaderImage key={fileId} fileId={fileId} />;
};

interface AvatarUploaderProps {
  'data-qa-anchor'?: string;
  onChange: (fileId: string) => void;
  value?: string | null;
  mimeType?: string;
}

const AvatarUploader = ({
  'data-qa-anchor': dataQaAnchor = '',
  onChange,
  value: avatarFileId,
  mimeType,
}: AvatarUploaderProps) => {
  const [loadedAvatar, setLoadedAvatar] = useState<File[]>([]);
  const [uploadedAvatar, setUploadedAvatar] = useState<Amity.File[]>([]);
  const file = useFile(avatarFileId);

  const handleChange = (files: Amity.File[]) => {
    if (files.length > 0) {
      const file = files[files.length - 1];
      file?.fileId && onChange(file.fileId);
    }
  };

  const fileUrl = useMemo(
    () => file && FileRepository.fileUrlWithSize(file?.fileUrl, 'medium'),
    [file],
  );

  const { uploading, uploaded, progress } = useFileUpload({
    files: loadedAvatar,
    uploadedFiles: uploadedAvatar,
    onChange: ({ uploaded, uploading }) => {
      handleChange(uploaded);

      setUploadedAvatar(uploaded);
      setLoadedAvatar(uploading);
    },
  });

  return (
    <AvatarUploadContainer>
      <ImageRenderer uploading={uploading} uploaded={uploaded} progress={progress} />
      <BgImage src={fileUrl} />
      <CoverImageLoader
        data-qa-anchor={`${dataQaAnchor}-avatar-uploader`}
        mimeType={mimeType}
        onChange={(newAvatar: File[]) => setLoadedAvatar(newAvatar)}
      >
        <AvatarUploadButton>
          <StyledCameraIcon /> &nbsp; Upload image
        </AvatarUploadButton>
      </CoverImageLoader>
    </AvatarUploadContainer>
  );
};

export default AvatarUploader;
