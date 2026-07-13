import clsx from 'clsx';
import React from 'react';
import styles from './Spinner.module.css';

export const Spinner = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 21 21"
      fill="none"
      {...props}
      // Merge, don't overwrite: keep `styles.spinner` (the rotate animation)
      // even when a caller passes its own `className`.
      className={clsx(styles.spinner, className)}
    >
      <circle cx="10.5" cy="10.5" r="9" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
      <circle
        cx="10.5"
        cy="10.5"
        r="9"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeDasharray="46.75"
        strokeDashoffset="21"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="1"
      />
    </svg>
  );
};
