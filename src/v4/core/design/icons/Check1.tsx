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
        d="M19.4248 6.34277C19.8818 6.76465 19.8818 7.50293 19.4248 7.9248L10.4248 16.9248C10.0029 17.3818 9.26465 17.3818 8.84277 16.9248L4.34277 12.4248C3.88574 12.0029 3.88574 11.2646 4.34277 10.8428C4.76465 10.3857 5.50293 10.3857 5.9248 10.8428L9.65137 14.5342L17.8428 6.34277C18.2646 5.88574 19.0029 5.88574 19.4248 6.34277Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const Check1 = Object.assign(Solid, { Solid });
