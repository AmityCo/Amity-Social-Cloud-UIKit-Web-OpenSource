import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import clsx from 'clsx';
import { Button, ButtonProps } from '~/v4/core/natives/Button';

import styles from './HyperLinkButton.module.css';

const HyperLinkButtonSvg = (props: React.SVGProps<SVGSVGElement>) => {
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
        fill="currentColor"
        d="M18.04 14.21c1.792 1.794 1.898 4.677.316 6.575-.212.281-.07.14-2.954 3.024-1.933 1.933-5.062 1.933-6.96 0-1.934-1.899-1.934-5.028 0-6.961l2.214-2.215c.246-.246.703-.07.703.281.036.387.106.984.176 1.336.035.14 0 .281-.105.387l-1.617 1.617a2.95 2.95 0 000 4.183 2.95 2.95 0 004.183 0l2.637-2.636a2.95 2.95 0 000-4.184c-.176-.21-.563-.457-.809-.562-.14-.106-.246-.282-.21-.457.034-.387.21-.774.527-1.055l.14-.14a.435.435 0 01.492-.106c.457.246.88.527 1.266.914zm5.483-5.483c1.934 1.898 1.934 5.027 0 6.96l-2.214 2.215c-.247.246-.704.07-.704-.28a15.366 15.366 0 00-.175-1.337.397.397 0 01.105-.387l1.617-1.617a2.95 2.95 0 000-4.183 2.95 2.95 0 00-4.183 0l-2.637 2.636a2.95 2.95 0 000 4.184c.176.21.563.457.809.563.14.105.246.28.21.456a1.607 1.607 0 01-.527 1.055l-.14.14a.435.435 0 01-.493.106 5.265 5.265 0 01-1.265-.914c-1.793-1.793-1.899-4.676-.317-6.574.211-.281.07-.14 2.954-3.023 1.933-1.934 5.062-1.934 6.96 0z"
      ></path>
    </svg>
  );
};

interface HyperLinkButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onPress: ButtonProps['onPress'];
}

export const HyperLinkButton = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onPress = () => {},
}: HyperLinkButtonProps) => {
  const elementId = 'story_hyperlink_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button onPress={onPress} style={themeStyles} data-qa-anchor={accessibilityId}>
      <IconComponent
        defaultIcon={() => (
          <HyperLinkButtonSvg className={clsx(styles.hyperLinkButton, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
};
