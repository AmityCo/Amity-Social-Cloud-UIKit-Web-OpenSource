import React from 'react';
import { getDefaultConfig, useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './BackButton.module.css';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import { useAmityElement } from '~/v4/core/hooks/uikit';

const BackButtonSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="10"
    height="17"
    viewBox="0 0 10 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M8.62109 15.9141C8.44531 16.0898 8.19922 16.0898 8.02344 15.9141L0.640625 8.56641C0.5 8.39062 0.5 8.14453 0.640625 7.96875L8.02344 0.621094C8.19922 0.445312 8.44531 0.445312 8.62109 0.621094L9.32422 1.28906C9.46484 1.46484 9.46484 1.74609 9.32422 1.88672L2.96094 8.25L9.32422 14.6484C9.46484 14.7891 9.46484 15.0703 9.32422 15.2461L8.62109 15.9141Z" />
  </svg>
);

interface BackButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const BackButton = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onClick = () => {},
}: BackButtonProps) => {
  const elementId = 'back_button';
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
      className={styles.backButton}
      onClick={onClick}
      style={themeStyles}
    >
      <IconComponent
        defaultIcon={() => <BackButtonSvg className={defaultClassName} />}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </button>
  );
};
