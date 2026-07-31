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
        d="M12 4C16.4062 4 20 7.59375 20 12C20 16.4375 16.4062 20 12 20C7.5625 20 4 16.4375 4 12C4 7.59375 7.5625 4 12 4ZM12 18.5C15.5625 18.5 18.5 15.5938 18.5 12C18.5 8.4375 15.5625 5.5 12 5.5C8.40625 5.5 5.5 8.4375 5.5 12C5.5 15.5938 8.40625 18.5 12 18.5ZM12 13.5C11.5625 13.5 11.25 13.1875 11.25 12.75V8.75C11.25 8.34375 11.5625 8 12 8C12.4062 8 12.75 8.34375 12.75 8.75V12.75C12.75 13.1875 12.4062 13.5 12 13.5ZM12 14.5625C12.5312 14.5625 12.9688 15 12.9688 15.5312C12.9688 16.0625 12.5312 16.5 12 16.5C11.4375 16.5 11 16.0625 11 15.5312C11 15 11.4375 14.5625 12 14.5625Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const ExclamationCircle = Object.assign(Regular, { Regular });
