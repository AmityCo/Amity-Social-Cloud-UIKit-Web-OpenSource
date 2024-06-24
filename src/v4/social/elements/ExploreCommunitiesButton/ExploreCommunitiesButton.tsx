import React from 'react';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { Typography } from '~/v4/core/components';
import styles from './ExploreCommunitiesButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';

const Globe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M7.85254 0.25C12.1338 0.25 15.6025 3.71875 15.6025 8C15.6025 12.2812 12.1338 15.75 7.85254 15.75C3.57129 15.75 0.102539 12.2812 0.102539 8C0.102539 3.71875 3.57129 0.25 7.85254 0.25ZM13.4463 5.25C12.79 3.9375 11.6963 2.90625 10.3525 2.3125C10.79 3.125 11.1338 4.125 11.3525 5.25H13.4463ZM7.85254 1.75C7.25879 1.75 6.32129 3.0625 5.85254 5.25H9.82129C9.35254 3.0625 8.41504 1.75 7.85254 1.75ZM1.60254 8C1.60254 8.4375 1.63379 8.875 1.72754 9.25H4.13379C4.10254 8.84375 4.10254 8.4375 4.10254 8C4.10254 7.59375 4.10254 7.1875 4.13379 6.75H1.72754C1.63379 7.15625 1.60254 7.59375 1.60254 8ZM2.22754 10.75C2.88379 12.0625 3.97754 13.125 5.32129 13.7188C4.88379 12.9062 4.54004 11.9062 4.32129 10.75H2.22754ZM4.32129 5.25C4.54004 4.125 4.88379 3.125 5.32129 2.3125C3.97754 2.90625 2.88379 3.9375 2.22754 5.25H4.32129ZM7.85254 14.25C8.41504 14.25 9.35254 12.9688 9.82129 10.75H5.85254C6.32129 12.9688 7.25879 14.25 7.85254 14.25ZM10.04 9.25C10.0713 8.875 10.1025 8.4375 10.1025 8C10.1025 7.5625 10.0713 7.15625 10.04 6.75H5.63379C5.60254 7.15625 5.60254 7.5625 5.60254 8C5.60254 8.4375 5.60254 8.875 5.63379 9.25H10.04ZM10.3525 13.7188C11.6963 13.125 12.79 12.0625 13.4463 10.75H11.3525C11.1338 11.9062 10.79 12.9062 10.3525 13.7188ZM11.54 9.25H13.9775C14.04 8.875 14.1025 8.4375 14.1025 8C14.1025 7.59375 14.04 7.15625 13.9775 6.75H11.54C11.5713 7.1875 11.6025 7.59375 11.6025 8C11.6025 8.4375 11.5713 8.84375 11.54 9.25Z" />
  </svg>
);

interface DescriptionProps {
  pageId?: string;
  componentId?: string;
}

export function ExploreCommunitiesButton({ pageId = '*', componentId = '*' }: DescriptionProps) {
  const elementId = 'explore_communities_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <div
      className={styles.exploreCommunitiesButton}
      data-qa-anchor={accessibilityId}
      style={themeStyles}
    >
      <Globe className={styles.exploreCommunitiesButton__icon} />
      <Typography.BodyBold className={styles.exploreCommunitiesButton__text}>
        {config.text}
      </Typography.BodyBold>
    </div>
  );
}
