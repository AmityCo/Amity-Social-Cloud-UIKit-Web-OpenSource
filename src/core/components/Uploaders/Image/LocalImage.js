import React from 'react';
import PropTypes from 'prop-types';

import StyledImage from './styles';

const Image = ({ file, progress, imageFit, noBorder, onRemove, isRejected, retry = () => {} } = {}) => {
  const fileUrl = URL.createObjectURL(file);

  return (
    <StyledImage
      url={fileUrl}
      progress={progress}
      imageFit={imageFit}
      noBorder={noBorder}
      onRemove={onRemove}
      isRejected={isRejected}
      onRetry={() => retry()}
    />
  );
};

Image.propTypes = {
  file: PropTypes.instanceOf(File).isRequired,
  progress: PropTypes.number,
  noBorder: PropTypes.bool,
  imageFit: PropTypes.oneOf(['cover', 'contain']),
  onRemove: PropTypes.func,
  isRejected: PropTypes.bool,
  retry: PropTypes.func,
};

Image.defaultProps = {
  progress: -1,
  onRemove: null,
  isRejected: false,
  retry: () => {},
};

export default Image;
