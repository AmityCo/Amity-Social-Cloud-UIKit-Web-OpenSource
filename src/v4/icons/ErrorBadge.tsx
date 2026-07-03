import React from 'react';

export const ErrorBadge = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <circle cx="8" cy="8" r="7.25" fill="#FA4D30" stroke="#fff" strokeWidth="1.5"></circle>
    <path
      fill="#fff"
      d="M9.25 10.75C9.25 11.453 8.687 12 8 12c-.703 0-1.25-.547-1.25-1.25 0-.688.547-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25zM6.89 4.406A.378.378 0 017.267 4h1.453c.219 0 .39.188.375.406l-.203 4.25A.387.387 0 018.516 9H7.469a.387.387 0 01-.375-.344l-.203-4.25z"
    ></path>
  </svg>
);
