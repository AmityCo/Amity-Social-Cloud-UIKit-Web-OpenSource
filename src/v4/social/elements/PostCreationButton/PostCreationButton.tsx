import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { getDefaultConfig, useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import styles from './PostCreationButton.module.css';

const PostCreationButtonSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    style={{ pointerEvents: 'none' }}
    width="14"
    height="15"
    viewBox="0 0 14 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M13.0002 5.96667C13.5314 5.96667 14.0002 6.43542 14.0002 6.96667V7.96667C14.0002 8.52917 13.5314 8.96667 13.0002 8.96667H8.50016V13.4667C8.50016 14.0292 8.03141 14.4667 7.50016 14.4667H6.50016C5.93766 14.4667 5.50016 14.0292 5.50016 13.4667V8.96667H1.00016C0.437662 8.96667 0.000162125 8.52917 0.000162125 7.96667V6.96667C0.000162125 6.43542 0.437662 5.96667 1.00016 5.96667H5.50016V1.46667C5.50016 0.935425 5.93766 0.466675 6.50016 0.466675H7.50016C8.03141 0.466675 8.50016 0.935425 8.50016 1.46667V5.96667H13.0002Z" />
  </svg>
);

export interface PostCreationButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
  createPostButtonRef: React.RefObject<HTMLDivElement>;
}

export function PostCreationButton({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onClick,
  createPostButtonRef,
}: PostCreationButtonProps) {
  const elementId = 'post_creation_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <IconComponent
      defaultIcon={() => (
        <div
          style={themeStyles}
          className={styles.postCreationButton}
          onClick={onClick}
          data-qa-anchor={accessibilityId}
          ref={createPostButtonRef}
        >
          <PostCreationButtonSvg
            className={clsx(styles.postCreationButton__icon, defaultClassName)}
          />
        </div>
      )}
      imgIcon={() => (
        <img
          src={config.icon}
          alt={uiReference}
          className={clsx(styles.postCreationButton, imgClassName)}
          onClick={onClick}
          data-qa-anchor={accessibilityId}
        />
      )}
      defaultIconName={defaultConfig.icon}
      configIconName={config.icon}
    />
  );
}
