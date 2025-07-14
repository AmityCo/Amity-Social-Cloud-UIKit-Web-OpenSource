import React from 'react';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface TextButtonElementProps extends ButtonProps {
  pageId?: string;
  componentId?: string;
  elementId: string;
}

export function TextButtonElement({
  pageId = '*',
  componentId = '*',
  elementId,
  ...props
}: TextButtonElementProps) {
  const { accessibilityId, config, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button variant="text" {...props} data-testid={accessibilityId}>
      <Typography.BodyBold>{config.text ?? ''}</Typography.BodyBold>
    </Button>
  );
}
