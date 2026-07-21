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
        d="M14.6797 18.8932L8.24609 12.1784C8.07031 11.9675 8 11.7565 8 11.5456C8 11.3698 8.07031 11.1589 8.21094 10.9831L14.6445 4.26824C14.9609 3.91668 15.5234 3.91668 15.8398 4.23308C16.1914 4.54949 16.1914 5.07683 15.875 5.4284L10.0039 11.5456L15.9102 17.7331C16.2266 18.0495 16.2266 18.612 15.875 18.9284C15.5586 19.2448 14.9961 19.2448 14.6797 18.8932Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const ChevronLeft = Object.assign(Regular, { Regular });
