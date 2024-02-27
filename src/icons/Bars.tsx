import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="#292B32"
        d="M19.453 7.61H4.547a.406.406 0 01-.422-.423V6.063c0-.21.176-.421.422-.421h14.906c.211 0 .422.21.422.421v1.125c0 .247-.21.422-.422.422zm0 5.624H4.547a.406.406 0 01-.422-.421v-1.126c0-.21.176-.421.422-.421h14.906c.211 0 .422.21.422.421v1.126c0 .246-.21.421-.422.421zm0 5.625H4.547a.406.406 0 01-.422-.422v-1.125c0-.21.176-.421.422-.421h14.906c.211 0 .422.21.422.422v1.125c0 .246-.21.421-.422.421z"
      ></path>
    </svg>
  );
}

export default Icon;
