import React from 'react';

function Pen(props: React.SVGProps<SVGSVGElement>) {
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
        fill={props.fill ? props.fill : 'currentColor'}
        d="M20.332 5.254a2.228 2.228 0 010 3.164l-2.637 2.637L16.5 12.25l-8.578 8.578-4.008.422H3.81A.804.804 0 013 20.336l.422-4.008L12 7.75l1.195-1.195 2.637-2.637a2.3 2.3 0 011.582-.668 2.3 2.3 0 011.582.668l1.336 1.336zM7.148 19.21l8.157-8.121 1.09-1.09-2.145-2.145-1.09 1.09-8.12 8.157-.247 2.355 2.355-.246zM19.137 7.223a.552.552 0 000-.774L17.8 5.113a.6.6 0 00-.387-.176.6.6 0 00-.387.176L15.445 6.66l2.145 2.145 1.547-1.582z"
      ></path>
    </svg>
  );
}

export default Pen;
