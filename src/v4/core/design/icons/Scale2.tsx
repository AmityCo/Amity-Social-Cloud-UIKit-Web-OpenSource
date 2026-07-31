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
        d="M8.43848 18.7251L2.27832 12.6414C1.90723 12.2749 1.90723 11.6518 2.27832 11.2853L3.61426 9.96597C3.98535 9.59948 4.5791 9.59948 4.9502 9.96597L9.14355 14.0707L18.0498 5.27487C18.4209 4.90838 19.0146 4.90838 19.3857 5.27487L20.7217 6.59424C21.0928 6.96073 21.0928 7.58377 20.7217 7.95026L9.81152 18.7251C9.44043 19.0916 8.80957 19.0916 8.43848 18.7251Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const Scale2 = Object.assign(Solid, { Solid });
