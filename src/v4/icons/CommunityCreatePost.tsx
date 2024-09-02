import React from 'react';

export const CommunityCreatePostButtonIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="81"
      height="80"
      fill="none"
      viewBox="0 0 81 80"
      {...props}
    >
      <g filter="url(#filter0_dd_483_21580)">
        <circle cx="40.5" cy="36" r="32" fill="#1054DE"></circle>
      </g>
      <path
        fill="#fff"
        d="M50.125 35.036c.438 0 .875.437.875.875v1.75c0 .492-.438.875-.875.875H42.25v7.875c0 .492-.438.875-.875.875h-1.75a.864.864 0 01-.875-.875v-7.875h-7.875A.864.864 0 0130 37.66v-1.75c0-.438.383-.875.875-.875h7.875V27.16c0-.438.383-.875.875-.875h1.75c.438 0 .875.437.875.875v7.875h7.875z"
      ></path>
      <defs>
        <filter
          id="filter0_dd_483_21580"
          width="80"
          height="80"
          x="0.5"
          y="0"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="4"></feOffset>
          <feGaussianBlur stdDeviation="4"></feGaussianBlur>
          <feColorMatrix values="0 0 0 0 0.376471 0 0 0 0 0.380392 0 0 0 0 0.439216 0 0 0 0.2 0"></feColorMatrix>
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_483_21580"></feBlend>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset></feOffset>
          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
          <feColorMatrix values="0 0 0 0 0.156863 0 0 0 0 0.160784 0 0 0 0 0.239216 0 0 0 0.1 0"></feColorMatrix>
          <feBlend
            in2="effect1_dropShadow_483_21580"
            result="effect2_dropShadow_483_21580"
          ></feBlend>
          <feBlend in="SourceGraphic" in2="effect2_dropShadow_483_21580" result="shape"></feBlend>
        </filter>
      </defs>
    </svg>
  );
};
