import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      fill="none"
      viewBox="0 0 17 17"
      {...props}
    >
      <circle
        cx="8.842"
        cy="8.253"
        r="7.25"
        fill="#FA4D30"
        stroke="#fff"
        strokeWidth="1.5"
      ></circle>
      <path
        fill="#fff"
        d="M10.092 11.003c0 .703-.563 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25 0-.688.547-1.25 1.25-1.25.687 0 1.25.562 1.25 1.25zm-2.36-6.344a.378.378 0 01.375-.406h1.454c.218 0 .39.187.375.406l-.204 4.25a.387.387 0 01-.375.344H8.311a.387.387 0 01-.375-.344l-.204-4.25z"
      ></path>
    </svg>
  );
}

export default Icon;
