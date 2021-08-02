import React from 'react';
import PropTypes from 'prop-types';
import useFile from '~/core/hooks/useFile';

import StyledVideo from './styles';

const DistantVideo = ({ fileId, ...props }) => {
  const file = useFile(fileId);

  if (!file.fileId) return null;

  return <StyledVideo url={file.fileUrl} mimeType={file.attributes.mimeType} {...props} />;
};

DistantVideo.propTypes = {
  fileId: PropTypes.string.isRequired,
};

export default DistantVideo;
