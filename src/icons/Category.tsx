import React from 'react';

const Category = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="40" height="40" rx="20" fill="#D9E5FC" />
    <path
      d="M28 21C28 20.4688 27.5312 20 27 20H22C21.4375 20 21 20.4688 21 21V26C21 26.5625 21.4375 27 22 27H27C27.5312 27 28 26.5625 28 26V21ZM14 19C11.7812 19 10 20.8125 10 23C10 25.2188 11.7812 27 14 27C16.1875 27 18 25.2188 18 23C18 20.8125 16.1875 19 14 19ZM26.9688 17C27.75 17 28.25 16.1875 27.8438 15.5L24.875 10.5C24.4688 9.84375 23.5 9.84375 23.0938 10.5L20.125 15.5C19.7188 16.1875 20.2188 17 21 17H26.9688Z"
      fill="white"
    />
  </svg>
);

export default Category;

export const backgroundImage = `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' rx='20' fill='%23D9E5FC'/%3E%3Cpath d='M28 21C28 20.4688 27.5312 20 27 20H22C21.4375 20 21 20.4688 21 21V26C21 26.5625 21.4375 27 22 27H27C27.5312 27 28 26.5625 28 26V21ZM14 19C11.7812 19 10 20.8125 10 23C10 25.2188 11.7812 27 14 27C16.1875 27 18 25.2188 18 23C18 20.8125 16.1875 19 14 19ZM26.9688 17C27.75 17 28.25 16.1875 27.8438 15.5L24.875 10.5C24.4688 9.84375 23.5 9.84375 23.0938 10.5L20.125 15.5C19.7188 16.1875 20.2188 17 21 17H26.9688Z' fill='white'/%3E%3C/svg%3E%0A");`;
