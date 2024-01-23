import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" {...props}>
      <path
        fill="#fff"
        d="M16 27.91c-6.422 0-11.625-5.202-11.625-11.624C4.375 9.864 9.578 4.66 16 4.66s11.625 5.203 11.625 11.625S22.422 27.91 16 27.91zm-5.344-10.827l6.328 6.375c.47.422 1.172.422 1.594 0l.797-.797c.422-.422.422-1.172 0-1.594l-4.781-4.781 4.781-4.735c.422-.468.422-1.171 0-1.593l-.797-.797c-.422-.422-1.172-.422-1.594 0l-6.328 6.328c-.469.469-.469 1.172 0 1.594z"
        opacity="0.7"
      ></path>
    </svg>
  );
}

export default Icon;
