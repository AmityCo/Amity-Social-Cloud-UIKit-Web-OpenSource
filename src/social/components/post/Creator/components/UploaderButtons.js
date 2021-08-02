import { FileType } from '@amityco/js-sdk';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from '~/core/components/Uploaders/Loader';
import ImageAttachmentIcon from '~/icons/ImageAttachment';
import FileAttachmentIcon from '~/icons/FileAttachment';
import { VideoAttachmentIcon } from '../styles';

const StyledLoader = styled(Loader)`
  ${({ uploadLoading }) => uploadLoading && 'cursor: wait !important;'}
  ${({ disabled, theme }) => disabled && `color: ${theme.palette.neutral.shade2};`}
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
      disabled={imageUploadDisabled}
      onChange={onChangeImages}
      uploadLoading={uploadLoading}
      onMaxFilesLimit={onMaxFilesLimit}
      onFileSizeLimit={onFileSizeLimit}
      fileLimitRemaining={fileLimitRemaining}
      mimeType="image/*"
      multiple
    >
      <ImageAttachmentIcon />
    </StyledLoader>

    <StyledLoader
      disabled={videoUploadDisabled}
      onChange={files => {
        files.forEach(file => {
          // eslint-disable-next-line no-param-reassign
          file.forceType = FileType.Video;
        });
        onChangeVideos(files);
      }}
      uploadLoading={uploadLoading}
      onMaxFilesLimit={onMaxFilesLimit}
      onFileSizeLimit={onFileSizeLimit}
      fileLimitRemaining={fileLimitRemaining}
      mimeType="video/*,.flv,.3gp"
      multiple
    >
      <VideoAttachmentIcon />
    </StyledLoader>

    <StyledLoader
      disabled={fileUploadDisabled}
      onChange={onChangeFiles}
      uploadLoading={uploadLoading}
      onMaxFilesLimit={onMaxFilesLimit}
      onFileSizeLimit={onFileSizeLimit}
      fileLimitRemaining={fileLimitRemaining}
      multiple
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
