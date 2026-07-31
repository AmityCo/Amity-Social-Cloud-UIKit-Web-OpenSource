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
        d="M4.26824 14.7148L10.9831 8.28125C11.194 8.10547 11.405 8 11.6159 8C11.8268 8 12.0026 8.07031 12.1784 8.21094L18.8932 14.6445C19.2448 14.9961 19.2448 15.5234 18.9284 15.8398C18.612 16.1914 18.0846 16.1914 17.7331 15.875L11.6159 10.0391L5.4284 15.9453C5.11199 16.2617 4.54949 16.2617 4.23308 15.9102C3.91668 15.5586 3.91668 15.0312 4.26824 14.7148Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const ChevronUp = Object.assign(Regular, { Regular });
