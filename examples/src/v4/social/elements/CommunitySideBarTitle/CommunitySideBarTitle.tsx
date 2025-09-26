import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunitySideBarTitle.module.css';

type CommunitySideBarTitleProps = {
  pageId?: string;
  componentId?: string;
};

export function CommunitySideBarTitle({
  pageId = '*',
  componentId = '*',
}: CommunitySideBarTitleProps) {
  const elementId = 'community_sidebar_title';
  const { accessibilityId, config, themeStyles, isExcluded } = useAmityElement({
    pageId,
    elementId,
    componentId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.community_sideBar__title}
    >
      {config.text}
    </Typography.TitleBold>
  );
}
