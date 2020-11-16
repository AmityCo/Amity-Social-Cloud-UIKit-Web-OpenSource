import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from '~/core/components/Uploaders/Loader';
import ImageAttachmentIcon from '~/icons/ImageAttachment';
import FileAttachmentIcon from '~/icons/FileAttachment';

const StyledLoader = styled(Loader)`
  ${({ uploadLoading }) => uploadLoading && 'cursor: wait !important;'}
`;

const PostCreatorUploaders = ({
  fileUploadDisabled,
  imageUploadDisabled,
  onChangeImages,
  onChangeFiles,
  uploadLoading,
  onMaxFilesLimit,
  fileLimitRemaining,
}) => (
  <>
    <StyledLoader
      disabled={imageUploadDisabled}
      onChange={onChangeImages}
      uploadLoading={uploadLoading}
      onMaxFilesLimit={onMaxFilesLimit}
      fileLimitRemaining={fileLimitRemaining}
      multiple
    >
      <ImageAttachmentIcon height="20px" />
    </StyledLoader>

    <StyledLoader
      disabled={fileUploadDisabled}
      onChange={onChangeFiles}
      uploadLoading={uploadLoading}
      onMaxFilesLimit={onMaxFilesLimit}
      fileLimitRemaining={fileLimitRemaining}
      multiple
    >
      <FileAttachmentIcon height="18px" />
    </StyledLoader>
  </>
);

PostCreatorUploaders.propTypes = {
  fileUploadDisabled: PropTypes.bool,
  imageUploadDisabled: PropTypes.bool,
  uploadLoading: PropTypes.bool,
  fileLimitRemaining: PropTypes.number,
  onChangeImages: PropTypes.func,
  onChangeFiles: PropTypes.func,
  onMaxFilesLimit: PropTypes.func,
};

PostCreatorUploaders.defaultProps = {
  fileUploadDisabled: false,
  imageUploadDisabled: false,
  uploadLoading: false,
  fileLimitRemaining: null,
  onChangeImages: () => {},
  onChangeFiles: () => {},
  onMaxFilesLimit: () => {},
};

export default PostCreatorUploaders;
