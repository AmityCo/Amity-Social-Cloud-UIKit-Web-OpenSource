import React from 'react';

const Svg = (props) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.824 4.72708L8.63343 7.84786C8.39883 8.05439 8.04692 8.05439 7.83578 7.82492L7.31965 7.32008C7.08504 7.11356 7.08504 6.74641 7.31965 6.53989L8.75073 5.25486L0.56305 5.25486C0.234605 5.25486 0 5.00244 0 4.70413V0.560002C0 0.250721 0.250722 0 0.560002 0L1.31683 4.36807e-06C1.62611 5.39397e-06 1.87683 0.250726 1.87683 0.560004V3.4191L8.75073 3.4191L7.31965 2.11113C7.08504 1.9046 7.08504 1.53745 7.31965 1.33093L7.83578 0.826096C8.04692 0.596627 8.39883 0.596627 8.63343 0.803149L11.824 3.92393C12.0587 4.1534 12.0587 4.49761 11.824 4.72708Z"
      fill="#636878"
    />
  </svg>
);

export default Svg;

export const backgroundImage = `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11.824 4.72708L8.63343 7.84786C8.39883 8.05439 8.04692 8.05439 7.83578 7.82492L7.31965 7.32008C7.08504 7.11356 7.08504 6.74641 7.31965 6.53989L8.75073 5.25486L0.56305 5.25486C0.234605 5.25486 0 5.00244 0 4.70413V0.560002C0 0.250721 0.250722 0 0.560002 0L1.31683 4.36807e-06C1.62611 5.39397e-06 1.87683 0.250726 1.87683 0.560004V3.4191L8.75073 3.4191L7.31965 2.11113C7.08504 1.9046 7.08504 1.53745 7.31965 1.33093L7.83578 0.826096C8.04692 0.596627 8.39883 0.596627 8.63343 0.803149L11.824 3.92393C12.0587 4.1534 12.0587 4.49761 11.824 4.72708Z' fill='%23636878'/%3E%3C/svg%3E");`;
