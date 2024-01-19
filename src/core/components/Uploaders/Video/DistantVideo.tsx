import React from 'react';
import useFile from '~/core/hooks/useFile';
import { VideoFileStatus, MP4MimeType } from '~/social/constants';

import StyledVideo, { StyledVideoProps } from './StyledVideo';

type DistantVideoProps = { fileId?: string } & StyledVideoProps;

const DistantVideo = ({ fileId, ...props }: DistantVideoProps) => {
  const file: Amity.File<'video'> | undefined = useFile<Amity.File<'video'>>(fileId);

  if (file == null) return null;

  /*
   * It's possible that certain video formats uploaded by the user are not
   * playable by the browser. So it's best to use the transcoded video file
   * which is an mp4 format to play video.
   *
   * Note: the below logic needs to be smarter based on users bandwidth and also
   * should be switchable by the user, which would require a ui update
   */
  const url = (() => {
    if (file.status === VideoFileStatus.Transcoded) {
      const { videoUrl } = file;

      return (
        videoUrl?.['1080p'] ||
        videoUrl?.['720p'] ||
        videoUrl?.['480p'] ||
        videoUrl?.['360p'] ||
        videoUrl?.original ||
        file.fileUrl
      );
    }
    return file.fileUrl;
  })();

  return <StyledVideo url={url} mimeType={MP4MimeType} {...props} />;
};

export default DistantVideo;
