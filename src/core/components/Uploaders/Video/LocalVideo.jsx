import React from 'react';
import PropTypes from 'prop-types';

import StyledVideo from './styles';

const LocalVideo = ({ file, ...props } = {}) => {
  const fileUrl = URL.createObjectURL(file);

  return <StyledVideo url={fileUrl} {...props} />;
};

LocalVideo.propTypes = {
  file: PropTypes.instanceOf(File).isRequired,
};

export default LocalVideo;
