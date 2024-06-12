import React from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';

import styles from './ClearButton.module.css';

function ClearButtonSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8.82715 17.3906C13.4238 17.3906 17.2119 13.5938 17.2119 9.00586C17.2119 4.40918 13.415 0.612305 8.82715 0.612305C4.23047 0.612305 0.442383 4.40918 0.442383 9.00586C0.442383 13.5938 4.23926 17.3906 8.82715 17.3906ZM5.88281 12.5479C5.54883 12.5479 5.28516 12.2842 5.28516 11.9502C5.28516 11.792 5.34668 11.6514 5.46973 11.5283L7.9834 9.01465L5.46973 6.49219C5.34668 6.37793 5.28516 6.22852 5.28516 6.07031C5.28516 5.74512 5.54883 5.49023 5.88281 5.49023C6.0498 5.49023 6.19043 5.54297 6.2959 5.66602L8.82715 8.17969L11.3584 5.65723C11.4902 5.52539 11.6221 5.47266 11.7803 5.47266C12.1055 5.47266 12.3691 5.73633 12.3691 6.06152C12.3691 6.22852 12.3164 6.36035 12.1934 6.4834L9.6709 9.01465L12.1846 11.5283C12.3076 11.6514 12.3691 11.7832 12.3691 11.9502C12.3691 12.2842 12.1055 12.5479 11.7627 12.5479C11.5957 12.5479 11.4551 12.4863 11.332 12.3721L8.82715 9.84961L6.32227 12.3721C6.19922 12.4863 6.0498 12.5479 5.88281 12.5479Z" />
    </svg>
  );
}

interface ClearButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const ClearButton = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onClick = () => {},
}: ClearButtonProps) => {
  const elementId = 'clear_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <button
      data-qa-anchor={accessibilityId}
      className={styles.clearButton}
      onClick={onClick}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => <ClearButtonSvg className={defaultClassName} />}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </button>
  );
};
