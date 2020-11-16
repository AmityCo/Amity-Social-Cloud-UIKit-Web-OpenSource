import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import GalleryGrid from '~/core/components/GalleryGrid';
import Uploader from '~/core/components/Uploaders/Uploader';
import Image from '~/core/components/Uploaders/Image';

const StyledGalleryGrid = styled(GalleryGrid)`
  ${({ uploadLoading }) => uploadLoading && `cursor: wait !important;`}
`;

const ImagesGallery = ({ uploading, uploaded, progress, removeFile, uploadLoading }) => {
  const allFiles = [...uploaded, ...uploading];
  return (
    <StyledGalleryGrid items={allFiles} uploadLoading={uploadLoading}>
      {file => {
        if (!file?.fileId) {
          return <Image key={file?.name} file={file} progress={progress[file?.name]} fullSize />;
        }
        const { fileId } = file;
        return <Image key={fileId} fileId={fileId} onRemove={() => removeFile(fileId)} fullSize />;
      }}
    </StyledGalleryGrid>
  );
};

const Images = ({ files, onChange, onLoadingChange, uploadLoading }) => (
  <Uploader files={files} onChange={onChange} onLoadingChange={onLoadingChange}>
    <ImagesGallery uploadLoading={uploadLoading} />
  </Uploader>
);

Images.propTypes = {
  files: PropTypes.array,
  onChange: PropTypes.func,
  onLoadingChange: PropTypes.func,
  uploadLoading: PropTypes.bool,
};

Images.defaultProps = {
  files: [],
  onChange: () => {},
  onLoadingChange: () => {},
  uploadLoading: false,
};

export default Images;
