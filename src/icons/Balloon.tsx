import React from 'react';

const Balloon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="262" height="243" fill="none" viewBox="0 0 262 243" {...props}>
    <g>
      <path fill="#BCF7FC" d="M104 149l-11 4 10 32 17 17-16-53z" />
      <path fill="#97E4FD" d="M162 174l5 11-31 15-24-2 50-24z" />
      <path fill="#E8F7F4" d="M190 32a78 78 0 00-109 76l43 45 66-121z" />
      <path fill="#231F20" d="M190 32l-45 131 62 1a78 78 0 00-17-132z" />
      <path fill="#EC95AD" d="M190 32l-66 121 52-3c7-9 13-20 18-31 17-39 16-78-4-87z" />
      <path fill="#4A82F2" d="M190 32c-20-9-50 16-67 56-5 11-9 23-10 34l21 36 56-126z" />
      <path fill="#4CBEFF" d="M130 169l37 16 25-11 15-10-63-28-22 10 8 23z" />
      <path fill="#71D1FE" d="M81 108l3 18 9 27 37 16 14-33-63-28z" />
      <path fill="#231F20" d="M136 200l-17-8-13 10 2 16 16 7 12-25z" />
      <path fill="#EC95AD" d="M103 185l16 7-11 26-16-7 11-26z" />
    </g>

    <g>
      <path
        fill="#D9E5FC"
        fillRule="evenodd"
        d="M54 89c4-5 6-11 6-17 0-15-13-28-29-28C16 44 3 57 3 72s13 28 28 28c7 0 13-2 17-5l12 3-6-9z"
        clipRule="evenodd"
      />
      <path
        fill="#1054DE"
        d="M24 61c3 0 6 2 7 4 2-2 4-4 7-4 5 0 9 4 9 8 0 11-16 17-16 17s-15-6-15-17c0-4 4-8 8-8z"
      />
    </g>
  </svg>
);

export default Balloon;

export const backgroundImage = `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='262' height='243' fill='none' viewBox='0 0 262 243'%3E%3Cg rel='balloon'%3E%3Cpath fill='%23BCF7FC' d='M104 149l-11 4 10 32 17 17-16-53z'/%3E%3Cpath fill='%2397E4FD' d='M162 174l5 11-31 15-24-2 50-24z'/%3E%3Cpath fill='%23E8F7F4' d='M190 32a78 78 0 00-109 76l43 45 66-121z'/%3E%3Cpath fill='%23231F20' d='M190 32l-45 131 62 1a78 78 0 00-17-132z'/%3E%3Cpath fill='%23EC95AD' d='M190 32l-66 121 52-3c7-9 13-20 18-31 17-39 16-78-4-87z'/%3E%3Cpath fill='%234A82F2' d='M190 32c-20-9-50 16-67 56-5 11-9 23-10 34l21 36 56-126z'/%3E%3Cpath fill='%234CBEFF' d='M130 169l37 16 25-11 15-10-63-28-22 10 8 23z'/%3E%3Cpath fill='%2371D1FE' d='M81 108l3 18 9 27 37 16 14-33-63-28z'/%3E%3Cpath fill='%23231F20' d='M136 200l-17-8-13 10 2 16 16 7 12-25z'/%3E%3Cpath fill='%23EC95AD' d='M103 185l16 7-11 26-16-7 11-26z'/%3E%3C/g%3E%3Cg rel='heart'%3E%3Cpath fill='%23D9E5FC' fill-rule='evenodd' d='M54 89c4-5 6-11 6-17 0-15-13-28-29-28C16 44 3 57 3 72s13 28 28 28c7 0 13-2 17-5l12 3-6-9z' clip-rule='evenodd'/%3E%3Cpath fill='%231054DE' d='M24 61c3 0 6 2 7 4 2-2 4-4 7-4 5 0 9 4 9 8 0 11-16 17-16 17s-15-6-15-17c0-4 4-8 8-8z'/%3E%3C/g%3E%3C/svg%3E")`;
