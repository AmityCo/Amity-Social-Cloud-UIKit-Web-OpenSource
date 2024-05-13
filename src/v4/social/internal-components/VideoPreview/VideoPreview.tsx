import React from 'react';

type BaseVideoPreviewProps = {
  src: string;
  mimeType?: string;
  mediaFit?: string;
} & React.VideoHTMLAttributes<HTMLVideoElement>;

export const BaseVideoPreview = React.forwardRef<HTMLVideoElement, BaseVideoPreviewProps>(
  ({ src, mimeType, mediaFit, ...props }, ref) => (
    <video controls controlsList="nodownload" {...props} ref={ref} data-qa-anchor="video-preview">
      <source src={src} type={mimeType} />
      <p>
        Your browser does not support this format of video. Please try again later once the server
        transcodes the video into an playable format(mp4).
      </p>
    </video>
  ),
);
