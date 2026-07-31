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
        d="M18.9284 9.46355L12.2136 15.8971C12.0026 16.0729 11.7917 16.1432 11.6159 16.1432C11.405 16.1432 11.194 16.0729 11.0182 15.9323L4.26824 9.46355C3.91668 9.14715 3.91668 8.58465 4.23308 8.26824C4.54949 7.91668 5.11199 7.91668 5.4284 8.23308L11.6159 14.1393L17.7682 8.23308C18.0846 7.91668 18.6471 7.91668 18.9636 8.26824C19.28 8.58465 19.28 9.14715 18.9284 9.46355Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const ChevronDown = Object.assign(Regular, { Regular });
