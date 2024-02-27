import React from 'react';

const Svg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 320 512"
    fill="currentColor"
    {...props}
  >
    <path
      d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 
      0L24 329c-15.1-15.1-4.4-41 17-41z"
    />
  </svg>
);

export default Svg;
