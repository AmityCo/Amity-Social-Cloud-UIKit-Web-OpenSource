import clsx from 'clsx';
import React from 'react';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import styles from './StoryRing.module.css';

interface StoryRingProps extends React.SVGProps<SVGSVGElement> {
  pageId: '*';
  componentId: 'story_tab_component';
  hasUnseen?: boolean;
  uploading?: boolean;
  isErrored?: boolean;
  size?: number;
}

const StoryRing = ({
  pageId = '*',
  componentId = 'story_tab_component',
  hasUnseen = false,
  uploading = false,
  isErrored = false,
  size = 64,
  ...props
}: StoryRingProps) => {
  const elementId = 'story_ring';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  const scaleFactor = size / 64; // Assuming the default size is 64
  const ringSize = 48 * scaleFactor; // Adjust the ring size based on the scale factor
  const viewBox = `0 0 ${ringSize} ${ringSize}`;
  const ringRadius = 23 * scaleFactor;
  const strokeWidth = 2 * scaleFactor;

  const strokeDasharray = 339 * scaleFactor;
  const strokeDashoffset = (339 / 2) * scaleFactor;

  if (isElementExcluded) return null;

  if (isErrored) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        viewBox={viewBox}
        {...props}
      >
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={ringRadius}
          stroke={getComputedStyle(document.documentElement).getPropertyValue('--asc-color-alert')}
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox={viewBox}
    >
      <defs>
        <linearGradient
          id="story-ring-gradient"
          x1={`${(ringSize * 0.74).toFixed(2)}`}
          y1="1.875"
          x2={`${(ringSize * 0.22).toFixed(2)}`}
          y2={`${(ringSize - 1.875).toFixed(2)}`}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={elementConfig?.progress_color?.[0]} />
          <stop offset={1} stopColor={elementConfig?.progress_color?.[1]} />
        </linearGradient>
      </defs>
      <circle
        fill="none"
        style={{ stroke: 'var(--asc-color-secondary-shade4)' }}
        cx={ringSize / 2}
        cy={ringSize / 2}
        r={ringRadius}
        strokeWidth={strokeWidth}
        strokeDasharray={339 * scaleFactor}
        strokeDashoffset={0}
      />
      {hasUnseen && (
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={ringRadius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="url(#story-ring-gradient)"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={clsx(styles.progressRing, { [styles.uploading]: uploading })}
        />
      )}
    </svg>
  );
};

export default StoryRing;
