import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="16"
      fill="none"
      viewBox="0 0 14 16"
      {...props}
    >
      <path
        fill="#898E9E"
        d="M12.5 6c.813 0 1.5.688 1.5 1.5v7a1.5 1.5 0 01-1.5 1.5h-11A1.48 1.48 0 010 14.5v-7A1.5 1.5 0 011.5 6h1V4.5C2.5 2.031 4.5 0 7 0c2.5.031 4.5 2.063 4.5 4.563V6h1zM4 4.5V6h6V4.5c0-1.625-1.375-3-3-3-1.656 0-3 1.375-3 3zm8.5 10v-7h-11v7h11z"
      ></path>
    </svg>
  );
}

export default Icon;
