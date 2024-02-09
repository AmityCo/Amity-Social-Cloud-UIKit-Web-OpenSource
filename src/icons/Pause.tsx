import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      fill="none"
      viewBox="0 0 25 24"
      {...props}
    >
      <path
        fill="#fff"
        d="M9.688 20.09H6.312c-.949 0-1.687-.738-1.687-1.688V6.027c0-.914.738-1.687 1.688-1.687h3.375c.914 0 1.687.773 1.687 1.687v12.375c0 .95-.773 1.688-1.688 1.688zm10.687-1.688c0 .95-.773 1.688-1.688 1.688h-3.375c-.949 0-1.687-.738-1.687-1.688V6.027c0-.914.738-1.687 1.688-1.687h3.374c.915 0 1.688.773 1.688 1.687v12.375z"
      ></path>
    </svg>
  );
}

export default Icon;
