import React from 'react';

import { ActionButton } from '../ActionButton';
import { LinkIcon } from '~/icons';
import { useAmityElement } from '~/v4/core/hooks/uikit/index';

interface HyperLinkButtonProps {
  pageId?: string;
  componentId?: string;
  onClick: (e: React.MouseEvent) => void;
}

export const HyperLinkButton = ({
  pageId = '*',
  componentId = '*',
  onClick = () => {},
}: HyperLinkButtonProps) => {
  const elementId = 'story_hyperlink_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <ActionButton
      icon={<LinkIcon fill={themeStyles?.color || 'var(--asc-color-white)'} />}
      onClick={onClick}
    />
  );
};
