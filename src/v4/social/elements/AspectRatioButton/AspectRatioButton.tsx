import React from 'react';
import clsx from 'clsx';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './AspectRatioButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';

const AspectRatioSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M4.125 9.578v-4.36c0-.456.352-.843.844-.843h4.36c.21 0 .421.21.421.422v.844c0 .246-.21.421-.422.421H5.813v3.516c0 .246-.211.422-.422.422h-.844a.406.406 0 01-.422-.422zM14.25 4.797c0-.211.176-.422.422-.422h4.36c.456 0 .843.387.843.844v4.36c0 .245-.21.421-.422.421h-.844a.406.406 0 01-.422-.422V6.063h-3.515a.406.406 0 01-.422-.422v-.844zm5.203 9.703c.211 0 .422.21.422.422v4.36a.833.833 0 01-.844.843h-4.36a.406.406 0 01-.421-.422v-.844c0-.21.176-.422.422-.422h3.515v-3.515c0-.211.176-.422.422-.422h.844zM9.75 19.703c0 .246-.21.422-.422.422h-4.36c-.491 0-.843-.352-.843-.844v-4.36c0-.21.176-.421.422-.421h.844c.21 0 .421.21.421.422v3.515h3.516c.211 0 .422.211.422.422v.844z"
    ></path>
  </svg>
);

interface AspectRatioButtonProps {
  pageId?: string;
  componentId?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
  onClick: () => void;
}

export function AspectRatioButton({
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  imgIconClassName,
  onClick,
}: AspectRatioButtonProps) {
  const elementId = 'aspect_ratio_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <button onClick={onClick} className={styles.aspectRatioButton} data-qa-anchor={accessibilityId}>
      <IconComponent
        defaultIcon={() => (
          <AspectRatioSvg className={clsx(styles.aspectRatioButton__icon, defaultIconClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </button>
  );
}
