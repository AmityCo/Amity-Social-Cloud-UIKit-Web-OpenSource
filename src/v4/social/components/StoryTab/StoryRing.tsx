import React from 'react';
import styles from './StoryRing.module.css';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';

interface StoryRingProps extends React.SVGProps<SVGSVGElement> {
  pageId?: '*';
  componentId?: 'story_tab_component';
  hasUnseen?: boolean;
  uploading?: boolean;
  isErrored?: boolean;
  size?: number;
}

const EmptyStateRingSvg = ({
  pageId,
  componentId,
  elementId,
  size,
}: {
  pageId: string;
  componentId: string;
  elementId: string;
  size: number;
}) => {
  const { getConfig } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox={`0 0 ${size} ${size}`}
    >
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
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} className={styles.emptyStateRing} />
    </svg>
  );
};

const HasSeenRingSvg = ({
  pageId,
  componentId,
  elementId,
  size,
}: {
  pageId: string;
  componentId: string;
  elementId: string;
  size: number;
}) => {
  const { getConfig } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox={`0 0 ${size} ${size}`}
    >
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
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 1}
        strokeWidth="2"
        strokeLinecap="round"
        stroke="url(#story-ring-gradient)"
        fill="none"
        strokeDasharray={339}
        strokeDashoffset={0}
      />
    </svg>
  );
};

const UploadingRingSvg = ({
  pageId,
  componentId,
  elementId,
  size,
}: {
  pageId: string;
  componentId: string;
  elementId: string;
  size: number;
}) => {
  const { getConfig } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox={`0 0 ${size} ${size}`}
    >
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
        className={styles.uploadingProgressRing}
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 1}
        strokeWidth="2"
        strokeLinecap="round"
        stroke="url(#story-ring-gradient)"
        fill="none"
        strokeDasharray={339}
        strokeDashoffset={339}
        data-uploading={true}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};

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
  const { isExcluded } = useCustomization();
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;
  if (isErrored) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        viewBox={`0 0 ${size} ${size}`}
        {...props}
      >
        <circle
          cx="24"
          cy="24"
          r="23"
          stroke={getComputedStyle(document.documentElement).getPropertyValue('--asc-color-alert')}
          strokeWidth="2"
        ></circle>
      </svg>
    );
  }

  if (uploading) {
    return (
      <UploadingRingSvg
        pageId={pageId}
        componentId={componentId}
        elementId={elementId}
        size={size}
      />
    );
  }

  if (hasUnseen) {
    return (
      <HasSeenRingSvg pageId={pageId} componentId={componentId} elementId={elementId} size={size} />
    );
  }

  return (
    <EmptyStateRingSvg
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      size={size}
    />
  );
};

export default StoryRing;
