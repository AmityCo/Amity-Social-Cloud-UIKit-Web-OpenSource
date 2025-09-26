import React from 'react';

const NotificationIndicator = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 7 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="3.5" cy="3" r="3" />
  </svg>
);

export default NotificationIndicator;
