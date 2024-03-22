import React from 'react';
import { ProgressRing } from './styles';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';

interface StoryRingProps extends React.SVGProps<SVGSVGElement> {
  pageId?: string;
  componentId?: string;
  isSeen?: boolean;
  uploading?: boolean;
  isErrored?: boolean;
}

const StoryRing = ({
  pageId = '*',
  componentId = 'story_tab_component',
  isSeen = false,
  uploading = false,
  isErrored = false,
  ...props
}: StoryRingProps) => {
  const elementId = 'story_ring';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

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
          <stop stopColor={elementConfig?.progress_color?.[0]} />
          <stop offset={1} stopColor={elementConfig?.progress_color?.[1]} />
        </linearGradient>
      </defs>
      <circle
        fill="none"
        stroke={elementConfig?.background_color?.[0]}
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
