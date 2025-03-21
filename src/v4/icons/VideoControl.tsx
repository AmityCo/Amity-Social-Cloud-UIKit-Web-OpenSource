import React from 'react';

const VideoControl = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="20" cy="20" r="20" fill="black" fillOpacity="0.5" />
    <g clipPath="url(#clip0_212_1181)">
      <path d="M16 13V27L27 20L16 13Z" fill="white" />
    </g>
    <defs>
      <clipPath id="clip0_212_1181">
        <rect width="24" height="24" fill="white" transform="translate(8 8)" />
      </clipPath>
    </defs>
  </svg>
);

export default VideoControl;
