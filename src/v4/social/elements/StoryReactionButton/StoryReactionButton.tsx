import React from 'react';
import clsx from 'clsx';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

import styles from './StoryReactionButton.module.css';
import { Typography } from '~/v4/core/components/index';
import millify from 'millify';

const StoryReactionSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
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
        d="M17.793 11.025c.148.854.037 1.67-.334 2.338a3.437 3.437 0 01-.668 2.487c-.037 2.078-1.299 3.525-4.156 3.525h-.854c-3.785 0-4.935-1.41-6.605-1.447-.112.482-.594.853-1.114.853H1.688c-.667 0-1.187-.52-1.187-1.187V8.687c0-.63.52-1.187 1.188-1.187h3.636c.705-.594 1.707-2.227 2.56-3.08.52-.52.372-4.045 2.673-4.045 2.115 0 3.525 1.188 3.525 3.896 0 .706-.148 1.262-.334 1.745h1.373c1.781 0 3.191 1.521 3.191 3.154 0 .705-.185 1.299-.519 1.855zm-2.3 2.004c.816-.742.704-1.892.185-2.449.37 0 .853-.705.853-1.373-.037-.705-.63-1.41-1.41-1.41h-3.86c0-1.41 1.04-2.078 1.04-3.526 0-.89 0-2.115-1.744-2.115-.705.705-.372 2.487-1.41 3.526-1.002 1.002-2.45 3.6-3.526 3.6H5.25v6.939c1.967 0 3.71 1.373 6.346 1.373h1.41c1.299 0 2.264-.631 1.967-2.412.556-.334 1.002-1.373.52-2.153zM3.765 16.406a.903.903 0 00-.891-.89.88.88 0 00-.89.89c0 .52.37.89.89.89a.88.88 0 00.89-.89z"
      ></path>
    </svg>
  );
};

const StoryMyReactionSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="url(#paint0_linear_7702_34939)"></circle>
      <path
        fill="#fff"
        d="M7.486 10.575H5.42a.611.611 0 00-.62.619v6.187c0 .361.258.619.62.619h2.066c.336 0 .62-.258.62-.619v-6.187a.628.628 0 00-.62-.62zm-1.033 6.394a.596.596 0 01-.62-.62c0-.334.258-.618.62-.618.336 0 .62.284.62.619 0 .36-.284.619-.62.619zm8.264-10.055c0-1.908-1.24-2.114-1.859-2.114-.542 0-.775 1.031-.878 1.495-.155.567-.284 1.134-.672 1.521-.826.851-1.265 1.908-2.298 2.913a.415.415 0 00-.078.232v5.518c0 .154.13.283.284.31.414 0 .956.231 1.37.412.826.36 1.833.799 3.073.799h.077c1.11 0 2.428 0 2.944-.748.233-.31.285-.696.155-1.16.44-.438.646-1.263.44-1.934.439-.593.49-1.443.232-2.036.31-.31.516-.8.49-1.264 0-.799-.67-1.52-1.523-1.52h-2.635c.207-.723.878-1.341.878-2.424z"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_7702_34939"
          x1="9"
          x2="19.8"
          y1="2.4"
          y2="29.4"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5B9DFF"></stop>
          <stop offset="1" stopColor="#0041BE"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

interface StoryReactionButtonProps {
  myReactions?: string[];
  reactionsCount: number;
  pageId?: string;
  componentId?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
  onPress: () => void;
}

export const StoryReactionButton = ({
  myReactions = [],
  reactionsCount,
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  imgIconClassName,
  onPress,
}: StoryReactionButtonProps) => {
  const elementId = 'story_reaction_button';
  const { isExcluded, accessibilityId, config, uiReference, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const hasMyReactions = myReactions.length > 0;

  if (isExcluded) return null;

  return (
    <Button
      data-qa-anchor={accessibilityId}
      className={clsx(styles.storyReactionButton)}
      onPress={onPress}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => (
          <div className={clsx(styles.storyReactionIcon, defaultIconClassName)}>
            {hasMyReactions ? <StoryMyReactionSvg /> : <StoryReactionSvg />}
            <Typography.BodyBold>{millify(reactionsCount)}</Typography.BodyBold>
          </div>
        )}
        imgIcon={() => (
          <img src={config.icon} alt={uiReference} className={clsx(imgIconClassName)} />
        )}
      />
    </Button>
  );
};
