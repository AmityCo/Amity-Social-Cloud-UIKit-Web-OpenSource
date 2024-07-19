import React from 'react';
import clsx from 'clsx';
import { useAmityElement } from '~/v4/core/hooks/uikit';

import { Button } from '~/v4/core/components';

interface SaveButtonProps {
  pageId?: string;
  componentId?: string;
  className?: string;
  onClick?: () => void;
}

export function SaveButton({
  pageId = '*',
  componentId = '*',
  onClick,
  className,
}: SaveButtonProps) {
  const elementId = 'save_button';
  const { accessibilityId, config, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      variant="primary"
      className={clsx(className)}
      data-qa-anchor={accessibilityId}
      onClick={onClick}
    >
      {config.text}
    </Button>
  );
}
