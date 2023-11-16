import React from 'react';
import PropTypes from 'prop-types';
import useFile from '~/core/hooks/useFile';
import { VideoFileStatus, VideoQuality, MP4MimeType } from '~/social/constants';

import StyledVideo from './styles';

const DistantVideo = ({ fileId, ...props }) => {
  const file = useFile(fileId);

  if (!file.fileId) return null;

  let { fileUrl } = file;

  /*
   * It's possible that certain video formats uploaded by the user are not
   * playable by the browser. So it's best to use the transcoded video file
   * which is an mp4 format to play video.
   *
   * Note: the below logic needs to be smarter based on users bandwidth and also
   * should be switchable by the user, which would require a ui update
   */
  if (file.status === VideoFileStatus.Transcoded) {
    const { videoUrl } = file;

    switch (true) {
      case videoUrl.hasOwnProperty(VideoQuality.FHD):
        fileUrl = videoUrl[VideoQuality.FHD];
        break;

      case videoUrl.hasOwnProperty(VideoQuality.HD):
        fileUrl = videoUrl[VideoQuality.HD];
        break;

      case videoUrl.hasOwnProperty(VideoQuality.SD):
        fileUrl = videoUrl[VideoQuality.SD];
        break;

      case videoUrl.hasOwnProperty(VideoQuality.LD):
        fileUrl = videoUrl[VideoQuality.LD];
        break;

      default:
        fileUrl = videoUrl[VideoQuality.Original];
        break;
    }
  }

  return <StyledVideo url={fileUrl} mimeType={MP4MimeType} {...props} />;
};

DistantVideo.propTypes = {
  fileId: PropTypes.string.isRequired,
};

export default DistantVideo;
