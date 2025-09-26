import React from 'react';

export const CommunityCreatePostButtonIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_dd_4559_78802)">
        <circle cx="40" cy="36" r="32" fill="#1054DE" />
      </g>
      <path
        d="M49.625 35.0356C50.0625 35.0356 50.5 35.4731 50.5 35.9106V37.6606C50.5 38.1528 50.0625 38.5356 49.625 38.5356H41.75V46.4106C41.75 46.9028 41.3125 47.2856 40.875 47.2856H39.125C38.6328 47.2856 38.25 46.9028 38.25 46.4106V38.5356H30.375C29.8828 38.5356 29.5 38.1528 29.5 37.6606V35.9106C29.5 35.4731 29.8828 35.0356 30.375 35.0356H38.25V27.1606C38.25 26.7231 38.6328 26.2856 39.125 26.2856H40.875C41.3125 26.2856 41.75 26.7231 41.75 27.1606V35.0356H49.625Z"
        fill="white"
      />
      <defs>
        <filter
          id="filter0_dd_4559_78802"
          x="0"
          y="0"
          width="80"
          height="80"
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
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="4" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.376471 0 0 0 0 0.380392 0 0 0 0 0.439216 0 0 0 0.2 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4559_78802" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.156863 0 0 0 0 0.160784 0 0 0 0 0.239216 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_4559_78802"
            result="effect2_dropShadow_4559_78802"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_4559_78802"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
