import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import StyledImage from './styles';

const Image = ({ file, progress, onRemove = () => {} } = {}) => {
  const removeCallback = useCallback(() => onRemove(file), [onRemove]);

  const fileUrl = URL.createObjectURL(file);

  return <StyledImage url={fileUrl} progress={progress} onRemove={removeCallback} />;
};

Image.propTypes = {
  file: PropTypes.instanceOf(File).isRequired,
  progress: PropTypes.number,
  onRemove: PropTypes.func,
};

Image.defaultProps = {
  progress: -1,
  onRemove: () => {},
};

export default Image;
