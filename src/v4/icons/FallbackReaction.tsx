import React from 'react';

interface FallbackIconProps extends React.SVGProps<SVGSVGElement> {
  backgroundColor?: string;
}

const FallbackReaction = ({ backgroundColor, ...props }: FallbackIconProps) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="10" cy="10" r="10" fill="white" />
    <g clipPath="url(#clip0_13358_2173)">
      <path
        d="M10 1.5C14.6944 1.5 18.5 5.30558 18.5 10C18.5 14.6944 14.6944 18.5 10 18.5C5.30558 18.5 1.5 14.6944 1.5 10C1.5 5.30558 5.30558 1.5 10 1.5Z"
        stroke="currentColor"
      />
      <path
        d="M9.8817 5.92871C11.2879 5.92871 12.8114 7.05036 12.8114 8.50684C12.8114 10.4488 10.7188 10.4823 10.7188 11.2021V11.2859C10.7188 11.5202 10.5346 11.6876 10.317 11.6876H9.09487C8.87723 11.6876 8.69308 11.5202 8.69308 11.2859V11.1352C8.69308 10.0972 9.47991 9.67871 10.0826 9.34389C10.5848 9.05929 10.9029 8.87514 10.9029 8.4901C10.9029 7.98786 10.2667 7.66978 9.74777 7.66978C9.09487 7.66978 8.77679 7.97112 8.35826 8.4901C8.22433 8.65751 7.97321 8.69099 7.8058 8.55706L7.08594 8.0046C6.90179 7.88742 6.8683 7.6363 6.98549 7.46889C7.67188 6.48117 8.54241 5.92871 9.8817 5.92871ZM9.71429 12.1899C10.3504 12.1899 10.8694 12.7088 10.8694 13.345C10.8694 13.9812 10.3504 14.5001 9.71429 14.5001C9.06138 14.5001 8.54241 13.9812 8.54241 13.345C8.54241 12.7088 9.06138 12.1899 9.71429 12.1899Z"
        fill={backgroundColor || 'currentColor'}
      />
    </g>
    <defs>
      <clipPath id="clip0_13358_2173">
        <rect width="18" height="18" fill="white" transform="translate(1 1)" />
      </clipPath>
    </defs>
  </svg>
);

export default FallbackReaction;
