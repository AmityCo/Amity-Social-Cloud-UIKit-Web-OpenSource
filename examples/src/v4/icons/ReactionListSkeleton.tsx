import React from 'react';

const Svg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="375"
    height="56"
    viewBox="0 0 375 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="16" y="8" width="40" height="40" rx="20" fill="#292B32" />
    <rect x="64" y="24" width="140" height="8" rx="4" fill="#292B32" />
  </svg>
);

export default Svg;
