import React from 'react';
import styled from 'styled-components';

const Ban = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256
      8zm141.421 106.579c73.176 73.175 77.05 187.301 15.964 264.865L132.556 98.615c77.588-61.105
      191.709-57.193 264.865 15.964zM114.579
      397.421c-73.176-73.175-77.05-187.301-15.964-264.865l280.829 280.829c-77.588 61.105-191.709
      57.193-264.865-15.964z"
    />
  </svg>
);

export default styled(Ban)`
  fill: ${({ theme }) => theme.palette.base.shade3};
`;
