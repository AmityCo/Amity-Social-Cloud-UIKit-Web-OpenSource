import styled, { keyframes } from 'styled-components';

export const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const UISpinner = styled.svg`
  animation: ${rotateAnimation} 2s linear infinite;
`;
