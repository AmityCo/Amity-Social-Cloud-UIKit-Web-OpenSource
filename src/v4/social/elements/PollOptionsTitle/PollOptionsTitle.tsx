import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type PollOptionsTitleProps = {
  pageId?: string;
  componentId?: string;
};

export const PollOptionsTitle = ({ pageId = '*', componentId = '*' }: PollOptionsTitleProps) => {
  const elementId = 'poll_options_title';
  const { accessibilityId, themeStyles, config } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <Typography.TitleBold style={themeStyles} data-testid={accessibilityId}>
      {config.text}
    </Typography.TitleBold>
  );
};
