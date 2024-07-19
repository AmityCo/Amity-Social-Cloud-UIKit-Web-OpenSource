import React from 'react';
import clsx from 'clsx';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';

import styles from './SpeakerButton.module.css';

const SpeakerMuteSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <circle cx="16" cy="16" r="16" fill="#000" fillOpacity="0.5"></circle>
    <path
      fill="#fff"
      d="M15.121 9.781c.527-.527 1.441-.176 1.441.598v11.777c0 .774-.914 1.125-1.44.598l-3.13-3.129H8.406c-.492 0-.844-.352-.844-.844V13.72c0-.457.352-.844.844-.844h3.586l3.13-3.094zm9.316 6.469c0 2.25-1.16 4.29-3.023 5.52-.422.246-.95.105-1.16-.282a.845.845 0 01.246-1.16 4.807 4.807 0 002.25-4.078 4.792 4.792 0 00-2.25-4.043.845.845 0 01-.246-1.16.824.824 0 011.16-.281c1.863 1.23 3.023 3.27 3.023 5.484zm-4.992-2.672c.985.527 1.617 1.582 1.617 2.672 0 1.125-.632 2.18-1.617 2.707-.422.246-.914.105-1.16-.316a.869.869 0 01.352-1.16c.422-.247.738-.704.738-1.231 0-.492-.316-.95-.738-1.195a.87.87 0 01-.352-1.16c.246-.422.738-.563 1.16-.317z"
    ></path>
  </svg>
);

const SpeakerUnmuteSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 32 32"
      {...props}
    >
      <circle cx="16" cy="16" r="16" fill="#000" fillOpacity="0.5"></circle>
      <path
        fill="#fff"
        d="M25.781 22.344a.467.467 0 01.094.687l-.594.782c-.187.218-.5.28-.718.093L6.188 9.688A.468.468 0 016.093 9l.625-.781a.468.468 0 01.687-.094l4.75 3.656 1.563-1.531c.469-.469 1.281-.156 1.281.531v3.188l2.469 1.937a1.234 1.234 0 00-.625-.969.773.773 0 01-.313-1.03c.219-.376.657-.5 1.032-.282A2.739 2.739 0 0119 16c0 .344-.094.625-.188.938l1.22.937c.28-.563.468-1.188.468-1.875a4.26 4.26 0 00-2-3.594.75.75 0 01-.219-1.031c.219-.344.688-.469 1.032-.25C20.968 12.188 22 14.031 22 16a5.727 5.727 0 01-.75 2.813l1.188.937c.656-1.125 1.03-2.406 1.03-3.719 0-2.468-1.218-4.781-3.312-6.125-.343-.219-.437-.687-.218-1.062A.795.795 0 0121 8.625c2.5 1.656 4 4.406 4 7.375 0 1.688-.5 3.281-1.375 4.656l2.156 1.688zM7 13.75c0-.25.125-.469.344-.625L15 19.031v2.219c0 .688-.813 1-1.281.531L10.938 19H7.75a.722.722 0 01-.75-.75v-4.5z"
      ></path>
    </svg>
  );
};

interface SpeakerButtonProps {
  isMuted: boolean;
  pageId?: string;
  componentId?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
  onPress: () => void;
}

export function SpeakerButton({
  isMuted,
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  imgIconClassName,
  onPress,
}: SpeakerButtonProps) {
  const elementId = 'speaker_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      data-qa-anchor={accessibilityId}
      className={clsx(styles.speakerButton)}
      onPress={onPress}
      defaultIcon={() => (isMuted ? <SpeakerUnmuteSvg /> : <SpeakerMuteSvg />)}
      imgIcon={() => <img src={config.icon} alt={uiReference} className={clsx(imgIconClassName)} />}
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
    />
  );
}
