import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type PollQuestionTitleProps = {
  pageId?: string;
  componentId?: string;
};

export const PollQuestionTitle = ({ pageId = '*', componentId = '*' }: PollQuestionTitleProps) => {
  const elementId = 'poll_question_title';
  const { accessibilityId, themeStyles, config, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <Typography.TitleBold style={themeStyles} data-testid={accessibilityId}>
      {resolveText('amity_social_button_poll_question')}
    </Typography.TitleBold>
  );
};
