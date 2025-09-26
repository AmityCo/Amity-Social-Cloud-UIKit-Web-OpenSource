import React from 'react';
import Video from '~/core/components/Uploaders/Video';

interface VideoContentProps {
  videoFileId: {
    original: string;
    low?: string;
    medium?: string;
    high?: string;
  };
}

const VideoContent = ({ videoFileId }: VideoContentProps) => {
  const fileId = videoFileId.high || videoFileId.medium || videoFileId.low;

  return <Video fileId={fileId} />;
};

export default VideoContent;
