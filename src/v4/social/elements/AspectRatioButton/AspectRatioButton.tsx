import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

import styles from './AspectRatioButton.module.css';

const AspectRatioSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="16" fill="#000" fillOpacity="0.5"></circle>
    <path
      fill="currentColor"
      d="M8.125 13.578v-4.36c0-.456.352-.843.844-.843h4.36c.21 0 .421.21.421.422v.844c0 .246-.21.421-.422.421H9.813v3.516c0 .246-.211.422-.422.422h-.844a.406.406 0 01-.422-.422zM18.25 8.797c0-.211.176-.422.422-.422h4.36c.456 0 .843.387.843.844v4.36c0 .245-.21.421-.422.421h-.844a.406.406 0 01-.422-.422v-3.515h-3.515a.406.406 0 01-.422-.422v-.844zm5.203 9.703c.211 0 .422.21.422.422v4.36a.833.833 0 01-.844.843h-4.36a.406.406 0 01-.421-.422v-.844c0-.21.176-.422.422-.422h3.515v-3.515c0-.211.176-.422.422-.422h.844zm-9.703 5.203c0 .246-.21.422-.422.422h-4.36c-.491 0-.843-.352-.843-.844v-4.36c0-.21.176-.421.422-.421h.844c.21 0 .421.21.421.422v3.515h3.516c.211 0 .422.211.422.422v.844z"
    ></path>
  </svg>
);

interface AspectRatioButtonProps {
  pageId?: string;
  componentId?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
  onPress: ButtonProps['onPress'];
}

export function AspectRatioButton({
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  imgIconClassName,
  onPress,
}: AspectRatioButtonProps) {
  const elementId = 'aspect_ratio_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button className={styles.aspectRatioButton} data-qa-anchor={accessibilityId} onPress={onPress}>
      <IconComponent
        defaultIcon={() => <AspectRatioSvg className={defaultIconClassName} />}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
}
