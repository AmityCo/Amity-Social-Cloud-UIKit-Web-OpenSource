import React from 'react';

const Love = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g id="Reactions">
      <circle id="Ellipse 2" cx="16" cy="16" r="16" fill="url(#paint0_linear_1709_1738)" />
      <path
        id="circle"
        d="M22.4466 10.5836C20.7296 9.07415 18.2009 9.36319 16.6088 11.0332L16.0156 11.6755L15.3912 11.0332C13.8303 9.36319 11.2704 9.07415 9.55338 10.5836C7.58661 12.3179 7.49295 15.401 9.24119 17.2637L15.2976 23.687C15.6722 24.1045 16.3278 24.1045 16.7024 23.687L22.7588 17.2637C24.507 15.401 24.4134 12.3179 22.4466 10.5836Z"
        fill="white"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_1709_1738"
        x1="7.2"
        y1="7.2"
        x2="28"
        y2="39.2"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#EE5C91" />
        <stop offset="0.833333" stop-color="#E02222" />
      </linearGradient>
    </defs>
  </svg>
);

export default Love;
