import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { ActionButton } from './styles';
import { useTheme } from 'styled-components';

interface BackButtonProps {
  pageId: 'create_story_page';
  componentId: '*';
  onClick: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export const HyperLinkButton = ({
  pageId = 'create_story_page',
  componentId = '*',
  onClick = () => {},
  style,
}: BackButtonProps) => {
  const theme = useTheme();
  const elementId = 'story_hyperlink_button';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const backgroundColor = elementConfig?.background_color;
  const hyperLinkIcon = elementConfig?.hyperlink_button_icon;

  const isElementExcluded = isExcluded(`${pageId}/*/${elementId}`);

  if (isElementExcluded) return null;

  return (
    <ActionButton
      name={hyperLinkIcon ? hyperLinkIcon : 'LinkIcon'}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      onClick={onClick}
    />
  );
};
