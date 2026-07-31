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
        d="M9.46355 4.26824L15.8971 10.9831C16.0378 11.1589 16.1432 11.3698 16.1432 11.5807C16.1432 11.7917 16.0378 12.0026 15.8971 12.1432L9.46355 18.8581C9.14715 19.2096 8.58465 19.2096 8.26824 18.8932C7.91668 18.5768 7.91668 18.0495 8.23308 17.6979L14.1393 11.5456L8.23308 5.4284C7.91668 5.11199 7.91668 4.54949 8.26824 4.23308C8.58465 3.91668 9.14715 3.91668 9.46355 4.26824Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const ChevronRight = Object.assign(Regular, { Regular });
