import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Uploader from '~/core/components/Uploaders/Uploader';
import File from '~/core/components/Uploaders/File';

const StylesFileRows = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0.5em;
  min-height: 1em;
  margin-bottom: 1rem;
  ${({ uploadLoading }) => uploadLoading && `cursor: wait !important;`}
`;

const FileRows = ({
  uploading,
  uploaded,
  progress,
  removeFile,
  uploadLoading,
  rejected,
  retry,
  rowDataQaAnchor,
}) => (
  <StylesFileRows uploadLoading={uploadLoading}>
    {uploaded.map(file => (
      <File
        key={file.fileId}
        data-qa-anchor={rowDataQaAnchor}
        fileId={file.fileId}
        onRemove={() => removeFile(file)}
      />
    ))}

    {uploading.map(file => (
      <File
        key={file.name}
        data-qa-anchor={rowDataQaAnchor}
        file={file}
        progress={progress[file.name]}
        isRejected={rejected.includes(file.name)}
        retry={retry}
        onRemove={() => removeFile(file)}
      />
    ))}
  </StylesFileRows>
);

const Files = ({
  files,
  onChange,
  onLoadingChange,
  uploadLoading,
  onError,
  rowDataQaAnchor = 'social-create-post-uploaded-file',
}) => (
  <Uploader files={files} onChange={onChange} onLoadingChange={onLoadingChange} onError={onError}>
    <FileRows uploadLoading={uploadLoading} rowDataQaAnchor={rowDataQaAnchor} />
  </Uploader>
);

Files.propTypes = {
  files: PropTypes.array,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  onLoadingChange: PropTypes.func,
  uploadLoading: PropTypes.bool,
  rowDataQaAnchor: PropTypes.string,
};

Files.defaultProps = {
  files: [],
  onChange: () => {},
  onError: () => {},
  onLoadingChange: () => {},
  uploadLoading: false,
  rowDataQaAnchor: undefined,
};

export default Files;
