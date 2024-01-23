import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const animateRing = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const RingWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Ring = styled.svg<{ uploading?: boolean }>`
  animation: ${(props) => (props.uploading ? animateRing : 'none')} 2s linear;
`;

interface StoryRingProps extends React.SVGProps<SVGSVGElement> {
  uploading?: boolean;
  isErrored?: boolean;
}

const StoryRing = ({ uploading = false, isErrored = false, ...props }: StoryRingProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (uploading) {
      interval = setInterval(() => {
        setRotation((prevRotation) => (prevRotation + 1) % 360);
      }, 10);
    } else {
      setRotation(0);
    }

    return () => {
      clearInterval(interval);
    };
  }, [uploading]);

  if (isErrored) {
    return (
      <RingWrapper>
        <Ring
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          fill="none"
          viewBox="0 0 64 64"
          style={{ transform: `rotate(${rotation}deg)` }}
          {...props}
        >
          <circle cx="32" cy="32" r="31" stroke="#FA4D30" strokeWidth="2"></circle>
          <defs>
            <linearGradient
              id="paint0_linear_3457_18804"
              x1="46.5"
              x2="13.5"
              y1="2.5"
              y2="61"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FA4D30"></stop>
              <stop offset="1" stopColor="#FA4D30"></stop>
            </linearGradient>
          </defs>
        </Ring>
      </RingWrapper>
    );
  }

  return (
    <RingWrapper>
      <Ring
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        fill="none"
        viewBox="0 0 64 64"
        style={{ transform: `rotate(${rotation}deg)` }}
        {...props}
      >
        <circle
          cx="32"
          cy="32"
          r="31"
          stroke="url(#paint0_linear_3457_18804)"
          strokeWidth="2"
        ></circle>
        <defs>
          <linearGradient
            id="paint0_linear_3457_18804"
            x1="46.5"
            x2="13.5"
            y1="2.5"
            y2="61"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#339AF9"></stop>
            <stop offset="1" stopColor="#78FA58"></stop>
          </linearGradient>
        </defs>
      </Ring>
    </RingWrapper>
  );
};

export default StoryRing;
