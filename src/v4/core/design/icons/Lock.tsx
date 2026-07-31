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
        d="M8 10V8C8 5.8125 9.78125 4 12 4C14.1875 4 16 5.8125 16 8V10H17C18.0938 10 19 10.9062 19 12V18C19 19.125 18.0938 20 17 20H7C5.875 20 5 19.125 5 18V12C5 10.9062 5.875 10 7 10H8ZM9.5 10H14.5V8C14.5 6.625 13.375 5.5 12 5.5C10.5938 5.5 9.5 6.625 9.5 8V10ZM6.5 18C6.5 18.2812 6.71875 18.5 7 18.5H17C17.25 18.5 17.5 18.2812 17.5 18V12C17.5 11.75 17.25 11.5 17 11.5H7C6.71875 11.5 6.5 11.75 6.5 12V18Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Light(props: React.SVGProps<SVGSVGElement>) {
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
        d="M8 10V8C8 5.8125 9.78125 4 12 4C14.1875 4 16 5.8125 16 8V10H16.5C17.875 10 19 11.125 19 12.5V17.5C19 18.9062 17.875 20 16.5 20H7.5C6.09375 20 5 18.9062 5 17.5V12.5C5 11.125 6.09375 10 7.5 10H8ZM9 10H15V8C15 6.34375 13.6562 5 12 5C10.3125 5 9 6.34375 9 8V10ZM6 17.5C6 18.3438 6.65625 19 7.5 19H16.5C17.3125 19 18 18.3438 18 17.5V12.5C18 11.6875 17.3125 11 16.5 11H7.5C6.65625 11 6 11.6875 6 12.5V17.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
        d="M9.5 8.5V10H14.5V8.5C14.5 7.125 13.375 6 12 6C10.5938 6 9.5 7.125 9.5 8.5ZM7.5 10V8.5C7.5 6.03125 9.5 4 12 4C14.4688 4 16.5 6.03125 16.5 8.5V10H17C18.0938 10 19 10.9062 19 12V18C19 19.125 18.0938 20 17 20H7C5.875 20 5 19.125 5 18V12C5 10.9062 5.875 10 7 10H7.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const Lock = Object.assign(Regular, { Regular, Light, Solid });
