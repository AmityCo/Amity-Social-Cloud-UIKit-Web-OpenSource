import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.svg`
  animation: ${rotateAnimation} 2s linear infinite;
`;

const Spinner = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <StyledSpinner
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      {...props}
    >
      <circle cx="10.5" cy="10.5" r="9" fill="none" stroke="white" strokeWidth="2" />
      <circle
        cx="10.5"
        cy="10.5"
        r="9"
        fill="none"
        stroke="#1054DE"
        strokeWidth="2"
        strokeDasharray="46.75"
        strokeDashoffset="21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledSpinner>
  );
};

export default Spinner;
