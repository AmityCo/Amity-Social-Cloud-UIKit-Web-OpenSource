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
        d="M13.5 13.5C16.5312 13.5 19 15.9688 19 19C19 19.5625 18.5312 20 18 20H6C5.4375 20 5 19.5625 5 19C5 15.9688 7.4375 13.5 10.5 13.5H13.5ZM6.5 18.5H17.4688C17.2188 16.5312 15.5312 15 13.5 15H10.5C8.4375 15 6.75 16.5312 6.5 18.5ZM12 12C9.78125 12 8 10.2188 8 8C8 5.8125 9.78125 4 12 4C14.1875 4 16 5.8125 16 8C16 10.2188 14.1875 12 12 12ZM12 5.5C10.5938 5.5 9.5 6.625 9.5 8C9.5 9.40625 10.5938 10.5 12 10.5C13.375 10.5 14.5 9.40625 14.5 8C14.5 6.625 13.375 5.5 12 5.5Z"
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
        d="M11.875 12C9.37891 12 7.375 9.99609 7.375 7.5C7.375 5.03906 9.37891 3 11.875 3C14.3359 3 16.375 5.03906 16.375 7.5C16.375 9.99609 14.3359 12 11.875 12ZM10.2578 13.6875H13.457C16.9375 13.6875 19.75 16.5 19.75 19.9805C19.75 20.543 19.2578 21 18.6953 21H5.01953C4.45703 21 4 20.543 4 19.9805C4 16.5 6.77734 13.6875 10.2578 13.6875Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const User = Object.assign(Regular, { Regular, Solid });
