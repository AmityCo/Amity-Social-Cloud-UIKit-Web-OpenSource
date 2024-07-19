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

const LivechatLoadingIndicator = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <StyledSpinner
      width="25"
      height="25"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading..."
      viewBox="0 0 100 100"
      version="1.1"
      {...props}
    >
      <defs id="defs3821" />

      <rect
        fill="#555555"
        height="6"
        opacity="0"
        rx="3"
        ry="3"
        transform="rotate(-90 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3793"
      />
      <rect
        fill="#555555"
        height="6"
        opacity="0.08333333333333333"
        rx="3"
        ry="3"
        transform="rotate(-60 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3795"
      />
      <rect
        fill="#555555"
        height="6"
        opacity="0.16666666666666666"
        rx="3"
        ry="3"
        transform="rotate(-30 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3797"
      />
      <rect
        fill="#555555"
        height="6"
        opacity="0.25"
        rx="3"
        ry="3"
        transform="rotate(0 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3799"
      />
      <rect
        fill="#555555"
        height="6"
        opacity="0.3333333333333333"
        rx="3"
        ry="3"
        transform="rotate(30 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3801"
      />
      <rect
        fill="#555555"
        height="6"
        opacity="0.4166666666666667"
        rx="3"
        ry="3"
        transform="rotate(60 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3803"
      />
      <rect
        fill="#555555"
        height="6"
        opacity="0.5"
        rx="3"
        ry="3"
        transform="rotate(90 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3805"
      />
      <rect
        fill="#555555"
        height="6"
        opacity="0.5833333333333334"
        rx="3"
        ry="3"
        transform="rotate(120 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3807"
      />
      <rect
        fill="#555555"
        height="6"
        opacity="0.6666666666666666"
        rx="3"
        ry="3"
        transform="rotate(150 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3809"
      />
      <rect
        fill="#555555"
        height="6"
        opacity="0.75"
        rx="3"
        ry="3"
        transform="rotate(180 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3811"
      />
      <rect
        fill="#555555"
        height="6"
        opacity="0.8333333333333334"
        rx="3"
        ry="3"
        transform="rotate(210 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3813"
      />
      <rect
        fill="#555555"
        height="6"
        opacity="0.9166666666666666"
        rx="3"
        ry="3"
        transform="rotate(240 50 50)"
        width="25"
        x="72"
        y="47"
        id="rect3815"
      />
    </StyledSpinner>
  );
};

export default LivechatLoadingIndicator;
