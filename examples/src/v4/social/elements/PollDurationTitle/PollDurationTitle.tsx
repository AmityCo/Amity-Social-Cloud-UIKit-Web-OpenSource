import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type PollDurationTitleProps = {
  pageId?: string;
  componentId?: string;
};

export const PollDurationTitle = ({ pageId = '*', componentId = '*' }: PollDurationTitleProps) => {
  const elementId = 'poll_duration_title';

  const { config, themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <Typography.TitleBold data-testid={accessibilityId} style={themeStyles}>
      {config.text}
    </Typography.TitleBold>
  );
};
