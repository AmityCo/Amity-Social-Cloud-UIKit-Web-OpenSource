import React from 'react';
import PropTypes from 'prop-types';

import StyledFile from './styles';

const File = ({
  'data-qa-anchor': dataQaAnchor,
  file,
  progress,
  onRemove,
  isRejected,
  retry = () => {},
}) => {
  let fileUrl = '';

  if (file.type.includes('image')) {
    fileUrl = URL.createObjectURL(file);
  }

  return (
    <StyledFile
      data-qa-anchor={dataQaAnchor}
      name={file.name}
      size={file.size}
      type={file.type}
      url={fileUrl}
      progress={progress}
      isRejected={isRejected}
      onRemove={onRemove}
      onRetry={() => retry()}
    />
  );
};

File.propTypes = {
  'data-qa-anchor': PropTypes.string,
  file: PropTypes.instanceOf(File).isRequired,
  progress: PropTypes.number,
  isRejected: PropTypes.bool,
  retry: PropTypes.func,
  onRemove: PropTypes.func,
};

File.defaultProps = {
  'data-qa-anchor': undefined,
  progress: -1,
  onRemove: null,
  isRejected: false,
  retry: () => {},
};

export default File;
