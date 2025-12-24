import React from 'react';

const LiveDot = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M8 10.75C6.33594 10.75 5 9.41406 5 7.75C5 6.09766 6.33594 4.75 8 4.75C9.65234 4.75 11 6.09766 11 7.75C11 9.41406 9.65234 10.75 8 10.75Z" />
  </svg>
);

export default LiveDot;
