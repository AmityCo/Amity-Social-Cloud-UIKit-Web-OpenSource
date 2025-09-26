import React from 'react';

function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <circle cx="10" cy="10" r="10" fill="url(#paint0_linear_5915_5776)"></circle>
      <path
        fill="#fff"
        d="M14.03 6.615c-1.074-.944-2.654-.763-3.65.28l-.37.402-.39-.401c-.976-1.044-2.576-1.225-3.65-.281-1.228 1.084-1.287 3.01-.194 4.175l3.785 4.014a.59.59 0 00.878 0l3.785-4.014c1.093-1.164 1.034-3.091-.195-4.175z"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_5915_5776"
          x1="4.5"
          x2="17.5"
          y1="4.5"
          y2="24.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E3447E"></stop>
          <stop offset="0.833" stopColor="#E02222"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Heart;
