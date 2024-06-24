import React from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';

import styles from './StoryImpressionButton.module.css';
import millify from 'millify';

const StoryImpressionSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#A5A9B5"
      d="M10 6.5c1.938 0 3.5 1.594 3.5 3.5 0 1.938-1.563 3.5-3.5 3.5A3.494 3.494 0 016.5 10c0-.281.063-.688.156-.969.188.125.594.219.844.219.938 0 1.75-.781 1.75-1.75-.031-.219-.125-.625-.25-.844.281-.062.719-.125 1-.156zm8.875 3.063a1.142 1.142 0 010 .906C17.187 13.78 13.812 16 10 16c-3.844 0-7.219-2.219-8.906-5.531a1.142 1.142 0 010-.906C2.78 6.25 6.156 4 10 4c3.813 0 7.188 2.25 8.875 5.563zM10 14.5c3.063 0 5.906-1.719 7.406-4.5-1.5-2.781-4.343-4.5-7.406-4.5-3.094 0-5.938 1.719-7.438 4.5 1.5 2.781 4.344 4.5 7.438 4.5z"
    ></path>
  </svg>
);

interface StoryImpressionButtonButtonProps {
  pageId?: string;
  componentId?: string;
  reach?: number | null;
  defaultIconClassName?: string;
  imgIconClassName?: string;
}

export function StoryImpressionButton({
  pageId = '*',
  componentId = '*',
  reach = 0,
  defaultIconClassName,
  imgIconClassName,
}: StoryImpressionButtonButtonProps) {
  const elementId = 'story_impression_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      defaultIcon={() => (
        <div
          className={clsx(styles.impressionButton, defaultIconClassName)}
          data-qa-anchor={accessibilityId}
        >
          <StoryImpressionSvg />
          <Typography.BodyBold>{reach}</Typography.BodyBold>
        </div>
      )}
      imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
    />
  );
}
