import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface TitleFormProps {
  pageId?: string;
  componentId?: string;
  elementId: string;
  className?: string;
}

export const TitleForm = ({
  pageId = '*',
  componentId = '*',
  elementId,
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
      {config.text}
    </Typography.TitleBold>
  );
};
