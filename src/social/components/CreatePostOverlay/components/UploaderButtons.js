import { FileType } from '@amityco/js-sdk';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from '~/core/components/Uploaders/Loader';
import ImageAttachmentIcon from '~/icons/ImageAttachment';
import FileAttachmentIcon from '~/icons/FileAttachment';
import { VideoAttachmentIcon } from '../styles';

const ALLOWED_VIDEO_MIME_TYPES = 'video/*,.flv,.3gp';

const StyledLoader = styled(Loader)`
  ${({ uploadLoading }) => uploadLoading && 'cursor: wait !important;'}
  ${({ disabled, theme }) => disabled && `color: ${theme.palette.neutral.shade2};`}
  z-index: 10;
`;

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
}) => (
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
      onChange={(files) => {
        files.forEach((file) => {
          // eslint-disable-next-line no-param-reassign
          file.forceType = FileType.Video;
        });
        onChangeVideos(files);
      }}
      onMaxFilesLimit={onMaxFilesLimit}
      onFileSizeLimit={onFileSizeLimit}
    >
      <VideoAttachmentIcon />
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

PostCreatorUploaders.propTypes = {
  fileUploadDisabled: PropTypes.bool,
  imageUploadDisabled: PropTypes.bool,
  videoUploadDisabled: PropTypes.bool,
  uploadLoading: PropTypes.bool,
  fileLimitRemaining: PropTypes.number,
  onChangeImages: PropTypes.func,
  onChangeVideos: PropTypes.func,
  onChangeFiles: PropTypes.func,
  onMaxFilesLimit: PropTypes.func,
  onFileSizeLimit: PropTypes.func,
};

PostCreatorUploaders.defaultProps = {
  fileUploadDisabled: false,
  imageUploadDisabled: false,
  videoUploadDisabled: false,
  uploadLoading: false,
  fileLimitRemaining: null,
  onChangeImages: () => {},
  onChangeVideos: () => {},
  onChangeFiles: () => {},
  onMaxFilesLimit: () => {},
  onFileSizeLimit: () => {},
};

export default PostCreatorUploaders;
