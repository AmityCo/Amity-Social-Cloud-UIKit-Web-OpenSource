import React from 'react';
import styles from './PollOptionsDesc.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type PollOptionsDescProps = {
  pageId?: string;
  componentId?: string;
};

export const PollOptionsDesc = ({ pageId = '*', componentId = '*' }: PollOptionsDescProps) => {
  const elementId = 'poll_options_desc';
  const { accessibilityId, themeStyles, config } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <Typography.Caption
      className={styles.pollOptionsDesc__title}
      style={themeStyles}
      data-testid={accessibilityId}
    >
      {config.text}
    </Typography.Caption>
  );
};
