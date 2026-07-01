import React from 'react';

export const StoryAdCtaChevron = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 35 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_dd_18657_1690)">
      <path
        d="M3.00024 11.6771L18.0002 2.67711L32.0002 11.6771"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
    <defs>
      <filter
        id="filter0_dd_18657_1690"
        x="0"
        y="0"
        width="35.0005"
        height="15.1773"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.5" />
        <feGaussianBlur stdDeviation="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.376471 0 0 0 0 0.380392 0 0 0 0 0.439216 0 0 0 0.16 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_18657_1690" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="0.5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.156863 0 0 0 0 0.160784 0 0 0 0 0.239216 0 0 0 0.08 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_18657_1690"
          result="effect2_dropShadow_18657_1690"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_18657_1690"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
