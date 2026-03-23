import React from 'react';

export const Fullscreen = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm10 7h3v-3h2v5h-5v-2zM15 5v2h3v3h2V5h-5z"
      />
    </svg>
  );
};
