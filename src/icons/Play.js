import React from 'react';

const Svg = (props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g opacity="0.3">
      <circle cx="20" cy="20" r="20" fill="black" />
    </g>
    <path d="M16 13V27L27 20L16 13Z" fill="white" />
  </svg>
);

export default Svg;
