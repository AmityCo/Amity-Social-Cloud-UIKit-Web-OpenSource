import React from 'react';

const Svg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 14 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.1875 0.125H0.8125C0.496094 0.125 0.25 0.40625 0.25 0.6875V1.8125C0.25 2.12891 0.496094
      2.375 0.8125 2.375H13.1875C13.4688 2.375 13.75 2.12891 13.75 1.8125V0.6875C13.75 0.40625
      13.4688 0.125 13.1875 0.125Z"
      fill="#A5A9B5"
    />
  </svg>
);

export default Svg;
