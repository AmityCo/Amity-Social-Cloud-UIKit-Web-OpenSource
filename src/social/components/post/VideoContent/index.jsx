import React from 'react';
import PropTypes from 'prop-types';
import Video from '~/core/components/Uploaders/Video';

const VideoContent = ({ videoFileId }) => {
  const fileId = videoFileId.high || videoFileId.medium || videoFileId.low;

  return <Video fileId={fileId} />;
};

VideoContent.propTypes = {
  videoFileId: PropTypes.shape({
    original: PropTypes.string.isRequired,
    low: PropTypes.string,
    medium: PropTypes.string,
    high: PropTypes.string,
  }).isRequired,
};

export default VideoContent;
