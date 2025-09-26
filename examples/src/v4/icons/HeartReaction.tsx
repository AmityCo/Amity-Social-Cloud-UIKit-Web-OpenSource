import React from 'react';
import { v4 } from 'uuid';

const HeartReaction = (props: React.SVGProps<SVGSVGElement>) => {
  const localId = v4();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="33"
      viewBox="0 0 33 33"
      fill="none"
      {...props}
    >
      <circle cx="16.8203" cy="16.7798" r="16" fill={`url(#paint_${localId})`} />
      <path
        d="M23.2669 11.3633C21.5499 9.85381 19.0212 10.1429 17.4291 11.8129L16.8359 12.4552L16.2116 11.8129C14.6506 10.1429 12.0907 9.85381 10.3737 11.3633C8.40692 13.0975 8.31327 16.1807 10.0615 18.0434L16.1179 24.4666C16.4925 24.8841 17.1481 24.8841 17.5227 24.4666L23.5791 18.0434C25.3274 16.1807 25.2337 13.0975 23.2669 11.3633Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id={`paint_${localId}`}
          x1="8.02031"
          y1="7.97979"
          x2="28.8203"
          y2="39.9798"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F76E9F" />
          <stop offset="0.833333" stopColor="#E82020" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default HeartReaction;
