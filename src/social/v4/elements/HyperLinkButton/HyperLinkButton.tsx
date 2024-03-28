import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';

import { useTheme } from 'styled-components';
import { ActionButton } from '../ActionButton';
import { LinkIcon } from '~/icons';

interface BackButtonProps {
  pageId: 'create_story_page';
  componentId: '*';
  onClick: (e: React.MouseEvent) => void;
}

export const HyperLinkButton = ({
  pageId = 'create_story_page',
  componentId = '*',
  onClick = () => {},
}: BackButtonProps) => {
  const theme = useTheme();
  const elementId = 'story_hyperlink_button';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const backgroundColor = elementConfig?.background_color;
  const hyperLinkIcon = elementConfig?.hyperlink_button_icon;

  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  return (
    <ActionButton
      icon={<LinkIcon width={24} height={24} fill={theme.v4.colors.baseInverse.default} />}
      onClick={onClick}
    />
  );
};
