import React from 'react';
import styles from './PollDurationDesc.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type PollDurationDescProps = {
  pageId?: string;
  componentId?: string;
};

export const PollDurationDesc = ({ pageId = '*', componentId = '*' }: PollDurationDescProps) => {
  const elementId = 'poll_duration_desc';

  const { config, themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <Typography.Caption
      data-testid={accessibilityId}
      style={themeStyles}
      className={styles.pollDurationDesc__text}
    >
      {config.text}
    </Typography.Caption>
  );
};
