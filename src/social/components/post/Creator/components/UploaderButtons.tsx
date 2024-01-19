import { FileType } from '@amityco/ts-sdk';
import React from 'react';
import styled from 'styled-components';
import Loader from '~/core/components/Uploaders/Loader';
import ImageAttachmentIcon from '~/icons/ImageAttachment';
import FileAttachmentIcon from '~/icons/FileAttachment';
import { VideoAttachmentIcon } from '../styles';

const ALLOWED_VIDEO_MIME_TYPES = 'video/*,.flv,.3gp';

const StyledLoader = styled(Loader)<{
  uploadLoading?: boolean;
  disabled?: boolean;
}>`
  ${({ uploadLoading }) => uploadLoading && 'cursor: wait !important;'}
  ${({ disabled, theme }) => disabled && `color: ${theme.palette.neutral.shade2};`}
`;

interface UploaderButtonsProps {
  fileUploadDisabled?: boolean;
  imageUploadDisabled?: boolean;
  videoUploadDisabled?: boolean;
  onChangeImages?: (files: File[]) => void;
  onChangeVideos?: (files: File[]) => void;
  onChangeFiles?: (files: File[]) => void;
  uploadLoading?: boolean;
  onMaxFilesLimit?: () => void;
  onFileSizeLimit?: () => void;
  fileLimitRemaining?: number | null;
}

const PostCreatorUploaders = ({
  fileUploadDisabled,
  imageUploadDisabled,
  videoUploadDisabled,
  onChangeImages,
  onChangeVideos,
  onChangeFiles,
  uploadLoading,
  onMaxFilesLimit,
  onFileSizeLimit,
  fileLimitRemaining,
}: UploaderButtonsProps): JSX.Element => (
  <>
    <StyledLoader
      data-qa-anchor="post-creator-image-attachment-button"
      disabled={imageUploadDisabled}
      uploadLoading={uploadLoading}
      fileLimitRemaining={fileLimitRemaining}
      mimeType="image/*"
      multiple
      onChange={onChangeImages}
      onMaxFilesLimit={onMaxFilesLimit}
      onFileSizeLimit={onFileSizeLimit}
    >
      <ImageAttachmentIcon />
    </StyledLoader>

    <StyledLoader
      data-qa-anchor="post-creator-video-attachment-button"
      disabled={videoUploadDisabled}
      uploadLoading={uploadLoading}
      fileLimitRemaining={fileLimitRemaining}
      mimeType={ALLOWED_VIDEO_MIME_TYPES}
      multiple
      onChange={(files: File[]) => {
        files.forEach((file: any) => {
          file.forceType = FileType.VIDEO;
        });
        onChangeVideos?.(files);
      }}
      onMaxFilesLimit={onMaxFilesLimit}
      onFileSizeLimit={onFileSizeLimit}
    >
      <VideoAttachmentIcon icon="video" />
    </StyledLoader>

    <StyledLoader
      data-qa-anchor="post-creator-file-attachment-button"
      disabled={fileUploadDisabled}
      uploadLoading={uploadLoading}
      fileLimitRemaining={fileLimitRemaining}
      multiple
      onChange={onChangeFiles}
      onMaxFilesLimit={onMaxFilesLimit}
      onFileSizeLimit={onFileSizeLimit}
    >
      <FileAttachmentIcon />
    </StyledLoader>
  </>
);

export default PostCreatorUploaders;
