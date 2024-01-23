import styled from 'styled-components';
import React from 'react';
import Avatar from '~/core/components/Avatar';
import { AddIcon, ErrorIcon } from '~/V4/icons';

export const ErrorButton = styled(ErrorIcon)`
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;
  z-index: 2;
`;

export const AddStoryButton = styled(AddIcon)`
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;
  z-index: 2;
`;

export const StoryWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  position: relative;
  cursor: pointer;
`;

export const StoryTabContainer = styled.div`
  position: relative;
  width: 3rem;
  display: flex;
  gap: 0.13rem;
  flex-direction: column;
  text-align: center;
  padding: 1rem 0.75rem;
  align-items: center;
`;

export const StoryAvatar = styled(Avatar)`
  width: 2.5rem;
  height: 2.5rem;
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  z-index: 1;
  cursor: pointer;
`;

export const StoryTitle = styled.div`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.base.main};
  cursor: pointer;
`;

export const AddButton = styled(AddIcon)`
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;
  z-index: 2;
`;

export const StoryRing = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="none"
      viewBox="0 0 64 64"
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
    </svg>
  );
};

export const StoryInputLabel = styled.label.attrs({ htmlFor: 'story-input' })`
  position: absolute;
  bottom: -5px;
  right: 0;
  z-index: 9999;
  cursor: pointer;
`;
