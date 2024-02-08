import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 28 28"
      {...props}
    >
      <path
        fill="#292B32"
        d="M13.813 7.219c.124-.157.374-.157.53 0l6.532 6.531a.36.36 0 010 .531l-6.531 6.531c-.156.157-.406.157-.531 0l-.626-.593c-.156-.157-.156-.407 0-.532l4.844-4.875H7.375A.361.361 0 017 14.438v-.876a.38.38 0 01.375-.374h10.656l-4.843-4.844c-.157-.125-.157-.375 0-.531l.624-.594z"
      ></path>
    </svg>
  );
}

export default Icon;
