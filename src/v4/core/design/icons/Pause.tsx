import React from 'react';

function Regular(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.03125 4C7.58984 4 8.0625 4.45833 8.0625 5V19C8.0625 19.5833 7.58984 20 7.03125 20C6.42969 20 6 19.5833 6 19V5C6 4.45833 6.42969 4 7.03125 4ZM15.9688 4C16.5273 4 17 4.45833 17 5V19C17 19.5833 16.5273 20 15.9688 20C15.3672 20 14.9375 19.5833 14.9375 19V5C14.9375 4.45833 15.3672 4 15.9688 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const Pause = Object.assign(Regular, { Regular });
