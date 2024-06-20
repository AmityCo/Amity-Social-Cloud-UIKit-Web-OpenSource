import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      fill="none"
      viewBox="0 0 25 24"
      {...props}
    >
      <path d="M19.531 10.809a1.71 1.71 0 010 2.918L7.156 21.039c-1.125.668-2.531-.14-2.531-1.477V4.938c0-1.44 1.512-2.039 2.531-1.44l12.375 7.312z"></path>
    </svg>
  );
}

export default Icon;
