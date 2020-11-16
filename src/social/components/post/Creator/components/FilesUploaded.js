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

const FileRows = ({ uploading, uploaded, progress, removeFile, uploadLoading }) => (
  <StylesFileRows uploadLoading={uploadLoading}>
    {uploaded.map(file => (
      <File key={file.fileId} fileId={file.fileId} onRemove={() => removeFile(file.fileId)} />
    ))}

    {uploading.map(file => (
      <File key={file.name} file={file} progress={progress[file.name]} />
    ))}
  </StylesFileRows>
);

const Files = ({ files, onChange, onLoadingChange, uploadLoading }) => (
  <Uploader files={files} onChange={onChange} onLoadingChange={onLoadingChange}>
    <FileRows uploadLoading={uploadLoading} />
  </Uploader>
);

Files.propTypes = {
  files: PropTypes.array,
  onChange: PropTypes.array,
  onLoadingChange: PropTypes.func,
  uploadLoading: PropTypes.bool,
};

Files.defaultProps = {
  files: [],
  onChange: [],
  onLoadingChange: () => {},
  uploadLoading: false,
};

export default Files;
