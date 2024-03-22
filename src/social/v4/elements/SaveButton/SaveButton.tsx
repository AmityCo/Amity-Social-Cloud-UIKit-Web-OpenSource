import React from 'react';
import { PrimaryButton } from '~/core/components/Button';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { RemoteImageButton } from './styles';
import { isValidHttpUrl } from '~/utils';
import { useTheme } from 'styled-components';

interface SaveButtonProps {
  pageId: '*';
  componentId: 'edit_comment_component';
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const SaveButton = ({
  pageId = '*',
  componentId = 'edit_comment_component',
  onClick,
  style,
}: SaveButtonProps) => {
  const theme = useTheme();
  const elementId = 'save_button';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const saveIcon = elementConfig?.save_icon;
  const isRemoteImage = saveIcon && isValidHttpUrl(saveIcon);

  return isRemoteImage ? (
    <RemoteImageButton
      src={saveIcon}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: elementConfig?.background_color || theme.v4.colors.secondary.default,
      }}
    />
  ) : (
    <PrimaryButton
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: elementConfig?.background_color || theme.v4.colors.secondary.default,
      }}
    >
      {elementConfig?.save_button_text}
    </PrimaryButton>
  );
};
