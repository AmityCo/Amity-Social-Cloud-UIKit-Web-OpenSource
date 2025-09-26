import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
      {...props}
    >
      <path
        fill="#1054DE"
        d="M9.281 3.813c.281.124.469.39.469.687 0 3.469-2.125 5.39-3.469 5.953a.743.743 0 01-.578 0C4.031 9.75 2.25 7.61 2.25 4.5c0-.297.172-.563.453-.688l3-1.25a.91.91 0 01.578 0l3 1.25zm-.734 1.78a.245.245 0 000-.343l-.36-.36a.245.245 0 00-.343 0L5.5 7.235 4.39 6.141a.245.245 0 00-.343 0l-.36.359a.245.245 0 000 .344l1.626 1.625c.093.11.265.11.359 0l2.875-2.875z"
      ></path>
    </svg>
  );
}

export default Icon;
