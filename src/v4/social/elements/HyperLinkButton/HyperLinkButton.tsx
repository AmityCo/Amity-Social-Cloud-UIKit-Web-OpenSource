import React from 'react';

import { useTheme } from 'styled-components';
import { ActionButton } from '../ActionButton';
import { LinkIcon } from '~/icons';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';

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
  const customIcon = elementConfig?.hyperlink_button_icon;
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const renderIcon = () => {
    if (customIcon) {
      if (customIcon.startsWith('http://') || customIcon.startsWith('https://')) {
        return (
          <img src={customIcon} alt={elementId} data-qa-anchor={elementId} width={24} height={24} />
        );
      }
    }

    return <LinkIcon width={24} height={24} fill={theme.v4.colors.baseInverse.default} />;
  };

  return (
    <ActionButton
      icon={renderIcon()}
      onClick={onClick}
      style={{
        backgroundColor: backgroundColor || theme.v4.colors.actionButton.default,
      }}
    />
  );
};
