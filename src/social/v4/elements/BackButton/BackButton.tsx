import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { UIBackButton, UIBackButtonImage } from './styles';
import { isValidHttpUrl } from '~/utils';
import { useTheme } from 'styled-components';

interface BackButtonProps {
  pageId?: 'create_story_page';
  componentId?: '*';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  'data-qa-anchor'?: string;
}

export const BackButton = ({
  pageId = 'create_story_page',
  componentId = '*',
  onClick = () => {},
  style,
}: BackButtonProps) => {
  const theme = useTheme();
  const elementId = 'back_button';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const backgroundColor = elementConfig?.background_color;
  const backIcon = elementConfig?.back_icon;

  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const isRemoteImage = backIcon && isValidHttpUrl(backIcon);

  return isRemoteImage ? (
    <UIBackButtonImage
      data-qa-anchor="back_button"
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      src={backIcon}
      onClick={onClick}
    />
  ) : (
    <UIBackButton
      data-qa-anchor="back_button"
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
      name={backIcon === 'back' ? 'ArrowLeftCircle2' : 'ArrowLeftCircle'}
      onClick={onClick}
      backgroundColor={backgroundColor}
    />
  );
};
