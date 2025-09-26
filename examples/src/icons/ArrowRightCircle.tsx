import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" {...props}>
      <path
        fill="#fff"
        d="M16 4.66c6.422 0 11.625 5.204 11.625 11.626S22.422 27.91 16 27.91 4.375 22.708 4.375 16.286 9.578 4.66 16 4.66zm5.297 10.829L14.969 9.16c-.422-.422-1.172-.422-1.594 0l-.797.797c-.422.421-.422 1.171 0 1.593l4.781 4.735-4.78 4.781c-.423.422-.423 1.172 0 1.594l.796.797c.422.422 1.172.422 1.594 0l6.328-6.375c.469-.422.469-1.125 0-1.594z"
        opacity="0.7"
      ></path>
    </svg>
  );
}

export default Icon;
