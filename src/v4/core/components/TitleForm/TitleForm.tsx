import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useString } from '~/v4/core/localization';

interface TitleFormProps {
  pageId?: string;
  componentId?: string;
  elementId: string;
  textId?: string;
  className?: string;
}

export const TitleForm = ({
  pageId = '*',
  componentId = '*',
  elementId,
  textId,
  className,
}: TitleFormProps) => {
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold style={themeStyles} data-testid={accessibilityId} className={className}>
      {textId ? useString(textId) : config.text}
    </Typography.TitleBold>
  );
};
