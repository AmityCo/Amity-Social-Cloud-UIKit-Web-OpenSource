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
    <path
      d="M28.0312 18.8086C29.1211 19.4766 29.1211 21.0586 28.0312 21.7266L15.6562 29.0391C14.5312 29.707 13.125 28.8984 13.125 27.5625V12.9375C13.125 11.4961 14.6367 10.8984 15.6562 11.4961L28.0312 18.8086Z"
      fill="white"
    />
  </svg>
);

export default VideoControl;
