import React from 'react';

function Solid(props: React.SVGProps<SVGSVGElement>) {
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
        d="M19.2722 10.6999C20.2426 11.2933 20.2426 12.6986 19.2722 13.292L8.25377 19.7877C7.2521 20.381 6 19.6628 6 18.476V5.48466C6 4.20426 7.346 3.67336 8.25377 4.20426L19.2722 10.6999Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const VideoPlay = Object.assign(Solid, { Solid });
