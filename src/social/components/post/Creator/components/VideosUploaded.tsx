import React from 'react';
import FilesUploaded from './FilesUploaded';

type VideoUploadedProps = Omit<React.ComponentProps<typeof FilesUploaded>, 'rowDataQaAnchor'>;

const VideoUploaded = (props: VideoUploadedProps) => {
  return <FilesUploaded {...props} rowDataQaAnchor="post-creator-uploaded-video" />;
};

export default VideoUploaded;
