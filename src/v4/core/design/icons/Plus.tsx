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
        d="M20 11.9615C20 12.5 19.5769 12.8846 19.0769 12.8846H12.9231V19.0385C12.9231 19.5769 12.5 20 12 20C11.4615 20 11.0769 19.5769 11.0769 19.0385V12.8846H4.92308C4.38462 12.8846 4 12.5 4 12C4 11.4615 4.38462 11.0385 4.92308 11.0385H11.0769V4.88462C11.0769 4.38462 11.4615 4 12 4C12.5 4 12.9231 4.38462 12.9231 4.88462V11.0385H19.0769C19.5769 11.0385 20 11.4615 20 11.9615Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Solid(props: React.SVGProps<SVGSVGElement>) {
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
        d="M13.3846 4.38462V10.6154H19.6154C20.351 10.6154 21 11.2644 21 12C21 12.7788 20.351 13.3846 19.6154 13.3846H13.3846V19.6154C13.3846 20.3942 12.7356 21 12 21C11.2212 21 10.6154 20.3942 10.6154 19.6154V13.3846H4.38462C3.60577 13.3846 3 12.7788 3 12C3 11.2644 3.60577 10.6154 4.38462 10.6154H10.6154V4.38462C10.6154 3.64904 11.2212 3 12 3C12.7356 3 13.3846 3.64904 13.3846 4.38462Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const Plus = Object.assign(Regular, { Regular, Solid });
