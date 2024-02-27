import React from 'react';
import styled, { keyframes } from 'styled-components';

const animateRing = keyframes`
  0% {
    stroke-dashoffset: 339;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const ProgressRing = styled.circle<{ uploading?: boolean }>`
  animation: ${(props) => (props.uploading ? animateRing : 'none')} 2s linear 0s infinite;
  -webkit-animation: ${(props) => (props.uploading ? animateRing : 'none')} 2s linear 0s infinite;
  -moz-animation: ${(props) => (props.uploading ? animateRing : 'none')} 2s linear 0s infinite;
`;

interface StoryRingProps extends React.SVGProps<SVGSVGElement> {
  isSeen?: boolean;
  uploading?: boolean;
  isErrored?: boolean;
}

const StoryRing = ({
  isSeen = false,
  uploading = false,
  isErrored = false,
  ...props
}: StoryRingProps) => {
  if (isErrored) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        fill="none"
        viewBox="0 0 48 48"
        {...props}
      >
        <circle cx="24" cy="24" r="23" stroke="#FA4D30" strokeWidth="2"></circle>
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48">
      <defs>
        <linearGradient
          id="story-ring-gradient"
          x1="35.4004"
          y1="1.875"
          x2="10.6504"
          y2="45.75"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#339AF9" />
          <stop offset={1} stopColor="#78FA58" />
        </linearGradient>
      </defs>
      <circle
        fill="none"
        stroke="#EBECEF"
        cx="24"
        cy="24"
        r="23"
        strokeWidth="2"
        strokeDasharray={339}
        strokeDashoffset={0}
      />
      {!isSeen && (
        <ProgressRing
          cx="24"
          cy="24"
          r="23"
          strokeWidth="2"
          strokeLinecap="round"
          stroke="url(#story-ring-gradient)"
          fill="none"
          strokeDashoffset={339}
          strokeDasharray={339 / 2}
          uploading={uploading}
          transform="rotate(-90, 24, 24)"
        />
      )}
    </svg>
  );
};

export default StoryRing;
