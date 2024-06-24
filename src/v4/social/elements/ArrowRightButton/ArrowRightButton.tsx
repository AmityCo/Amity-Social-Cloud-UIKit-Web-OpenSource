import React from 'react';
import clsx from 'clsx';

import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './ArrowRightButton.module.css';

interface ArrowRightButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const ArrowRightButtonSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path d="M12 .66c6.422 0 11.625 5.204 11.625 11.626S18.422 23.91 12 23.91.375 18.708.375 12.286 5.578.66 12 .66zm5.297 10.829L10.969 5.16c-.422-.422-1.172-.422-1.594 0l-.797.797c-.422.422-.422 1.172 0 1.593l4.781 4.735-4.78 4.781c-.423.422-.423 1.172 0 1.594l.796.797c.422.422 1.172.422 1.594 0l6.328-6.375c.469-.422.469-1.125 0-1.594z"></path>
  </svg>
);
export const ArrowRightButton = ({
  pageId = '*',
  componentId = '*',
  onClick,
}: ArrowRightButtonProps) => {
  const elementId = 'arrow_right_button';
  const { accessibilityId, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <button
      data-qa-anchor={accessibilityId}
      className={clsx(styles.storyButton, styles.desktopOnly)}
      onClick={onClick}
      style={themeStyles}
    >
      <ArrowRightButtonSvg />
    </button>
  );
};
