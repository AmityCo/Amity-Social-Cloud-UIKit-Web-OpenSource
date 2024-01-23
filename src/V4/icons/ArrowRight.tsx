import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="#292B32"
        d="M9.813 3.219c.124-.156.374-.156.53 0l6.532 6.531a.36.36 0 010 .531l-6.531 6.531c-.156.157-.406.157-.531 0l-.626-.593c-.156-.157-.156-.407 0-.532l4.844-4.874H3.375A.361.361 0 013 10.437v-.874a.38.38 0 01.375-.376h10.656L9.187 4.345c-.156-.125-.156-.375 0-.532l.626-.593z"
      ></path>
    </svg>
  );
}

export default Icon;
