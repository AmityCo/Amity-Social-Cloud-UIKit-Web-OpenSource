import React from 'react';

export const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      width="100%"
      height="100%"
      viewBox="0 0 15 14"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M6.813.219c.125-.157.375-.157.53 0l6.532 6.531a.36.36 0 010 .531l-6.531 6.532c-.157.156-.407.156-.532 0l-.625-.594c-.156-.156-.156-.406 0-.531l4.844-4.876H.375A.361.361 0 010 7.438v-.875a.38.38 0 01.375-.375h10.656L6.187 1.345c-.156-.125-.156-.375 0-.532L6.813.22z"
      ></path>
    </svg>
  );
};
