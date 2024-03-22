import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="19"
      fill="none"
      viewBox="0 0 16 19"
      {...props}
    >
      <path
        fill="#292B32"
        d="M15.313 3.063c.28 0 .562.28.562.562v.563a.578.578 0 01-.563.562h-.562l-.773 11.918c-.036.879-.809 1.582-1.688 1.582H3.676c-.88 0-1.653-.703-1.688-1.582L1.25 4.75H.687a.555.555 0 01-.562-.563v-.562c0-.281.246-.563.563-.563H3.57l1.196-1.968C5.046.637 5.68.25 6.207.25h3.55c.528 0 1.161.387 1.442.844l1.196 1.968h2.918zM6.207 1.937l-.668 1.125h4.887l-.668-1.124H6.207zm6.082 14.626l.738-11.813H2.937l.739 11.813h8.613z"
      ></path>
    </svg>
  );
}

export default Icon;
