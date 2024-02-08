import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 32 32"
      {...props}
    >
      <circle cx="16" cy="16" r="16" fill="#000" fillOpacity="0.5"></circle>
      <path
        fill="#fff"
        d="M16.176 23.914c-.14.176-.422.176-.598 0L8.23 16.566a.405.405 0 010-.597l7.348-7.348c.176-.176.457-.176.598 0l.703.668c.176.176.176.457 0 .598l-5.45 5.449h12.024c.211 0 .422.21.422.422v.984c0 .246-.21.422-.422.422H11.43l5.449 5.484c.176.141.176.422 0 .598l-.703.668z"
      ></path>
    </svg>
  );
}

export default Icon;
