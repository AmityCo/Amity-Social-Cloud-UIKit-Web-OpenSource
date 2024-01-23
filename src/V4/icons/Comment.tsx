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
        fill="#A5A9B5"
        d="M10 2.188c4.682 0 8.5 3.12 8.5 6.906C18.5 12.912 14.682 16 10 16c-1.295 0-2.49-.232-3.586-.63-.797.663-2.457 1.693-4.648 1.693-.133 0-.2-.034-.266-.133-.033-.1 0-.233.066-.3 0-.032 1.395-1.493 1.827-3.187-1.196-1.195-1.893-2.69-1.893-4.35 0-3.784 3.785-6.905 8.5-6.905z"
      ></path>
    </svg>
  );
}

export default Icon;
