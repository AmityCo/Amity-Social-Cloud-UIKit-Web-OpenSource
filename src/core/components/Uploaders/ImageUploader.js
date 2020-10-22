import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import useFileUpload from '~/core/hooks/useFileUpload';

import Image from './Image';
import FileLoader from './FileLoader';

// cursor wrapper
const UiKitImageLoader = styled(FileLoader)`
  ${({ uploading }) => uploading && 'cursor: wait !important;'}
`;

const ImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > * {
    height: 10em;
    margin: 0 0.5em 0.5em 0;
  }
`;

const ImageUploader = ({ disabled, children, onChange, ...props }) => {
  const { uploading, uploaded, progress, addFiles, removeFile } = useFileUpload(onChange);

  // browser loading callback from FileLoader
  const onLoad = useCallback(files => addFiles(files));

  return (
    <UiKitImageLoader
      uploading={!!uploading.length}
      disabled={!!disabled || !!uploading.length}
      onChange={onLoad}
      {...props}
    >
      <ImageRow>
        {uploaded.map(file => (
          <Image key={file.fileId} fileId={file.fileId} onRemove={() => removeFile(file.fileId)} />
        ))}

        {uploading.map(file => (
          <Image key={file.name} file={file} progress={progress[file.name]} onRemove={null} />
        ))}
      </ImageRow>

      {!uploading.length && !uploaded.length && children}
    </UiKitImageLoader>
  );
};

ImageUploader.propTypes = {
  mimeType: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

ImageUploader.defaultProps = {
  mimeType: '*/*',
  multiple: false,
  disabled: false,
  onChange: () => {},
  children: [],
};

export default ImageUploader;
