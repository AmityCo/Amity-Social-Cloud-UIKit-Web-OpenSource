import React from 'react';

function Icon(props: React.SVGProps<SVGSVGElement>) {
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
        fill="currentColor"
        d="M19.313 6.063c.28 0 .562.28.562.562v.563a.578.578 0 01-.563.562h-.562l-.773 11.918c-.036.879-.809 1.582-1.688 1.582H7.676c-.88 0-1.653-.703-1.688-1.582L5.25 7.75h-.563a.555.555 0 01-.562-.563v-.562c0-.281.246-.563.563-.563H7.57l1.196-1.968c.28-.457.914-.844 1.441-.844h3.55c.528 0 1.161.387 1.442.844l1.196 1.968h2.918zm-9.106-1.125l-.668 1.125h4.887l-.668-1.125h-3.551zm6.082 14.625l.738-11.813H6.937l.739 11.813h8.613z"
      ></path>
    </svg>
  );
}

export default Icon;
