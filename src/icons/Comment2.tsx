import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="16"
      fill="none"
      viewBox="0 0 18 16"
      {...props}
    >
      <path
        fill="#A5A9B5"
        d="M9 .188c4.682 0 8.5 3.12 8.5 6.906C17.5 10.912 13.682 14 9 14c-1.295 0-2.49-.232-3.586-.63-.797.663-2.457 1.693-4.648 1.693-.133 0-.2-.034-.266-.133-.033-.1 0-.233.066-.3 0-.032 1.395-1.493 1.827-3.187C1.197 10.248.5 8.753.5 7.093.5 3.31 4.285.189 9 .189z"
      ></path>
    </svg>
  );
}

export default Icon;
