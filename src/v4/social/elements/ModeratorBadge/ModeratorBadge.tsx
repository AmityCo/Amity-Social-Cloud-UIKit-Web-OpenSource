import React from 'react';
import styles from './ModeratorBadge.module.css';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import { useAmityElement } from '~/v4/core/hooks/uikit';

const Badge = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M7.57031 1.3125C7.85156 1.4375 8.03906 1.70312 8.03906 2C8.03906 5.46875 5.91406 7.39062 4.57031 7.95312C4.38281 8.03125 4.17969 8.03125 3.99219 7.95312C2.32031 7.25 0.539062 5.10938 0.539062 2C0.539062 1.70312 0.710938 1.4375 0.992188 1.3125L3.99219 0.0625C4.07031 0.03125 4.19531 0.015625 4.28906 0.015625C4.36719 0.015625 4.49219 0.03125 4.57031 0.0625L7.57031 1.3125ZM6.83594 3.09375C6.92969 3 6.92969 2.84375 6.83594 2.75L6.47656 2.39062C6.38281 2.29688 6.22656 2.29688 6.13281 2.39062L3.78906 4.73438L2.67969 3.64062C2.58594 3.54688 2.42969 3.54688 2.33594 3.64062L1.97656 4C1.88281 4.09375 1.88281 4.25 1.97656 4.34375L3.60156 5.96875C3.69531 6.07812 3.86719 6.07812 3.96094 5.96875L6.83594 3.09375Z" />
    </svg>
  );
};

interface ModeratorBadgeProps {
  pageId?: string;
  componentId?: string;
}

export function ModeratorBadge({ pageId = '*', componentId = '*' }: ModeratorBadgeProps) {
  const elementId = 'moderator_badge';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <div className={styles.moderatorBadge} style={themeStyles} data-qa-anchor={accessibilityId}>
      <Badge className={styles.moderatorBadge__icon} />
      <div className={styles.moderatorBadge__text}>{config.text}</div>
    </div>
  );
}
