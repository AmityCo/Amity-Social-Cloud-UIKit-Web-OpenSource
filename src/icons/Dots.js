import React from 'react';

const Svg = ({ className }) => (
  <svg className={className} width="25" height="25" fill="none" viewBox="0 0 25 25">
    <circle cx="3" cy="3" r="3" fill="#F3F0EA" opacity=".1" />
  </svg>
);

export default Svg;

export const backgroundImage = `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' fill='none' viewBox='0 0 25 25'%3E%3Ccircle cx='3' cy='3' r='3' fill='%23F3F0EA' opacity='.1'/%3E%3C/svg%3E")`;
