import React from 'react';
import PropTypes from 'prop-types';

import StyledFile from './styles';

const File = ({ file, progress, onRemove }) => {
  let fileUrl = '';

  if (file.type.includes('image')) {
    fileUrl = URL.createObjectURL(file);
  }

  return (
    <StyledFile
      name={file.name}
      size={file.size}
      type={file.type}
      url={fileUrl}
      progress={progress}
      onRemove={onRemove}
    />
  );
};

File.propTypes = {
  file: PropTypes.instanceOf(File).isRequired,
  progress: PropTypes.number,
  onRemove: PropTypes.func,
};

File.defaultProps = {
  progress: -1,
  onRemove: null,
};

export default File;
