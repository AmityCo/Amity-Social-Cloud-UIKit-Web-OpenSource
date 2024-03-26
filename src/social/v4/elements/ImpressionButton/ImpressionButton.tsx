import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { IconButton, RemoteImageButton } from './styles';
import { isValidHttpUrl } from '~/utils';
import { useTheme } from 'styled-components';

interface ImpressionButtonProps {
  pageId: 'story_page';
  componentId: '*';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  'data-qa-anchor'?: string;
}

export const ImpressionButton = ({
  pageId = 'story_page',
  componentId = '*',
  onClick = () => {},
  style,
}: ImpressionButtonProps) => {
  const theme = useTheme();
  const elementId = 'story_impression_button';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const backgroundColor = elementConfig?.background_color;
  const impressionIcon = elementConfig?.impression_icon;

  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const isRemoteImage = impressionIcon && isValidHttpUrl(impressionIcon);

  return isRemoteImage ? (
    <RemoteImageButton
      data-qa-anchor="reach_button"
      src={impressionIcon}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      onClick={onClick}
    />
  ) : (
    <IconButton
      data-qa-anchor="reach_button"
      name={impressionIcon === 'impressionIcon' ? 'EyeIcon' : impressionIcon}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      onClick={onClick}
    />
  );
};
