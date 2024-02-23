import React from 'react';
import styled, { css } from 'styled-components';
import Loader from '~/core/components/Uploaders/Loader';
import ImageAttachmentIcon from '~/icons/ImageAttachment';
import FileAttachmentIcon from '~/icons/FileAttachment';

const StyledLoader = styled(Loader)<{ uploadLoading?: boolean }>`
  ${({ uploadLoading }) =>
    uploadLoading &&
    css`
      cursor: wait !important;
    `}
`;

interface PostCreatorUploadersProps {
  fileUploadDisabled?: boolean;
  imageUploadDisabled?: boolean;
  uploadLoading?: boolean;
  fileLimitRemaining?: number;
  onChangeImages?: (files: File[]) => void;
  onChangeFiles?: (files: File[]) => void;
  onMaxFilesLimit?: () => void;
}

const PostCreatorUploaders = ({
  fileUploadDisabled,
  imageUploadDisabled,
  onChangeImages,
  onChangeFiles,
  uploadLoading,
  onMaxFilesLimit,
  fileLimitRemaining,
}: PostCreatorUploadersProps) => (
  <>
    <StyledLoader
      disabled={imageUploadDisabled}
      uploadLoading={uploadLoading}
      fileLimitRemaining={fileLimitRemaining}
      multiple
      onChange={(files) => onChangeImages?.(files)}
      onMaxFilesLimit={onMaxFilesLimit}
    >
      <ImageAttachmentIcon height="20px" width="20px" />
    </StyledLoader>

    <StyledLoader
      disabled={fileUploadDisabled}
      uploadLoading={uploadLoading}
      fileLimitRemaining={fileLimitRemaining}
      multiple
      onChange={(files) => onChangeFiles?.(files)}
      onMaxFilesLimit={onMaxFilesLimit}
    >
      <FileAttachmentIcon height="18px" width="18px" />
    </StyledLoader>
  </>
);

export default PostCreatorUploaders;
