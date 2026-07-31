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
        d="M20 12C20 16.4375 16.4062 20 12 20C7.5625 20 4 16.4375 4 12C4 7.59375 7.5625 4 12 4C16.4062 4 20 7.59375 20 12ZM6.875 7.96875C6 9.09375 5.5 10.5 5.5 12C5.5 15.5938 8.40625 18.5 12 18.5C13.5 18.5 14.9062 18 16.0312 17.125L6.875 7.96875ZM18.5 12C18.5 8.4375 15.5625 5.5 12 5.5C10.4688 5.5 9.0625 6.03125 7.9375 6.90625L17.0938 16.0625C17.9688 14.9375 18.5 13.5312 18.5 12Z"
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
        d="M20 12C20 16.4375 16.4062 20 12 20C7.5625 20 4 16.4375 4 12C4 7.59375 7.5625 4 12 4C16.4062 4 20 7.59375 20 12ZM6.6875 7.4375C5.625 8.65625 5 10.25 5 12C5 15.875 8.125 19 12 19C13.75 19 15.3438 18.375 16.5625 17.3125L6.6875 7.4375ZM19 12C19 8.15625 15.8438 5 12 5C10.2188 5 8.625 5.65625 7.40625 6.71875L17.2812 16.5938C18.3438 15.375 19 13.7812 19 12Z"
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
        d="M15.4688 16.9062L7.09375 8.53125C6.40625 9.53125 6 10.7188 6 12C6 15.3125 8.6875 18 12 18C13.2812 18 14.4688 17.5938 15.4688 16.9062ZM16.875 15.5C17.5625 14.5 18 13.3125 18 12C18 8.6875 15.3125 6 12 6C10.6875 6 9.5 6.4375 8.5 7.125L16.875 15.5ZM20 12C20 16.4375 16.4062 20 12 20C7.5625 20 4 16.4375 4 12C4 7.59375 7.5625 4 12 4C16.4062 4 20 7.59375 20 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const Ban = Object.assign(Regular, { Regular, Light, Solid });
