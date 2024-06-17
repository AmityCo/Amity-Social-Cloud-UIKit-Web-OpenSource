import React from 'react';
import clsx from 'clsx';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './ArrowLeftButton.module.css';

interface ArrowLeftButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const ArrowLeftButtonSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path d="M12 23.91C5.578 23.91.375 18.709.375 12.287.375 5.864 5.578.66 12 .66s11.625 5.203 11.625 11.625S18.422 23.91 12 23.91zM6.656 13.084l6.328 6.375c.47.422 1.172.422 1.594 0l.797-.797c.422-.422.422-1.172 0-1.594l-4.781-4.781 4.781-4.735c.422-.468.422-1.171 0-1.593l-.797-.797c-.422-.422-1.172-.422-1.594 0l-6.328 6.328c-.468.469-.468 1.172 0 1.594z"></path>
  </svg>
);
export const ArrowLeftButton = ({
  pageId = '*',
  componentId = '*',
  onClick,
}: ArrowLeftButtonProps) => {
  const elementId = 'arrow_left_button';
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
      <ArrowLeftButtonSvg />
    </button>
  );
};
