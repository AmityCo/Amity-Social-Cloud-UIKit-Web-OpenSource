import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import useFileUpload from '~/core/hooks/useFileUpload';

import File from './File';
import FileLoader from './FileLoader';

// cursor wrapper
const UiKitFileLoader = styled(FileLoader)`
  ${({ uploading }) => uploading && 'cursor: wait !important;'}
`;

const FileRows = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0.5em;
  min-height: 1em;
`;

const FileUploader = ({ disabled, children, onChange, ...props }) => {
  const { uploading, uploaded, progress, addFiles, removeFile } = useFileUpload(onChange);

  // browser loading callback from FileLoader
  const onLoad = useCallback(files => addFiles(files));

  const hasFiles = uploading.length + uploaded.length !== 0;

  return (
    <UiKitFileLoader
      uploading={!!uploading.length}
      disabled={!!disabled || !!uploading.length}
      onChange={onLoad}
      {...props}
    >
      {hasFiles && (
        <FileRows>
          {uploaded.map(file => (
            <File key={file.fileId} fileId={file.fileId} onRemove={() => removeFile(file.fileId)} />
          ))}

          {uploading.map(file => (
            <File key={file.name} file={file} progress={progress[file.name]} />
          ))}
        </FileRows>
      )}

      {!uploading.length && !uploaded.length && children}
    </UiKitFileLoader>
  );
};

FileUploader.propTypes = {
  mimeType: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

FileUploader.defaultProps = {
  mimeType: '*/*',
  multiple: false,
  disabled: false,
  onChange: () => {},
  children: [],
};

export default FileUploader;
