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
        d="M9.14286 20H5.71429C4.75 20 4 19.25 4 18.2857V5.71429C4 4.78571 4.75 4 5.71429 4H9.14286C10.0714 4 10.8571 4.78571 10.8571 5.71429V18.2857C10.8571 19.25 10.0714 20 9.14286 20ZM20 18.2857C20 19.25 19.2143 20 18.2857 20H14.8571C13.8929 20 13.1429 19.25 13.1429 18.2857V5.71429C13.1429 4.78571 13.8929 4 14.8571 4H18.2857C19.2143 4 20 4.78571 20 5.71429V18.2857Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const VideoPause = Object.assign(Solid, { Solid });
