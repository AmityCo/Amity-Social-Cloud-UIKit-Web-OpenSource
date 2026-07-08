import React from 'react';
import styles from './CreateStoryBadge.module.css';

export const CreateStoryBadge = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <circle
      cx="8"
      cy="8"
      r="7.25"
      fill="#1054DE"
      strokeWidth="1.5"
      className={styles.createStoryBadge__border}
    ></circle>
    <path
      fill="#fff"
      d="M11.438 7.625c.156 0 .312.156.312.313v.625a.321.321 0 01-.313.312H8.626v2.813a.321.321 0 01-.313.312h-.624a.308.308 0 01-.313-.313V8.876H4.562a.309.309 0 01-.312-.313v-.624c0-.157.137-.313.313-.313h2.812V4.812c0-.156.137-.312.313-.312h.625c.156 0 .312.156.312.313v2.812h2.813z"
    ></path>
  </svg>
);
