import clsx from 'clsx';
import React from 'react';
import styles from './Spinner.module.css';

export const Spinner = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      {...props}
      // Merge, don't overwrite: a caller passing `className` (e.g. the toast's
      // size/color class) must not strip `styles.spinner`, which carries the
      // rotate animation — otherwise the spinner renders static.
      className={clsx(styles.spinner, className)}
    >
      <circle cx="10.5" cy="10.5" r="9" fill="none" stroke="white" strokeWidth="2" />
      <circle
        cx="10.5"
        cy="10.5"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="46.75"
        strokeDashoffset="21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
