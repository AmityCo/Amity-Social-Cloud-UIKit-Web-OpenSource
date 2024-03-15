import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { SecondaryButton } from '~/core/components/Button';
import { StyledRemoteImageButton } from './styles';
import { useIntl } from 'react-intl';
import { isValidHttpUrl } from '~/utils';
import { useTheme } from 'styled-components';

interface CancelButtonProps {
  pageId: '*';
  componentId: 'edit_comment_component';
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const CancelButton = ({
  pageId = '*',
  componentId = 'edit_comment_component',
  onClick = () => {},
  style,
}: CancelButtonProps) => {
  const theme = useTheme();
  const elementId = 'cancel_button';
  const { formatMessage } = useIntl();
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  const cancelButtonText = elementConfig?.cancel_button_text;
  const backgroundColor = elementConfig?.background_color;
  const cancelButton = elementConfig?.back_icon;

  if (isElementExcluded) return null;

  const isRemoteImage = cancelButton && isValidHttpUrl(cancelButton);

  return isRemoteImage ? (
    <StyledRemoteImageButton
      src={cancelButton}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
    >
      {formatMessage({ id: cancelButtonText })}
    </StyledRemoteImageButton>
  ) : (
    <SecondaryButton
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: backgroundColor || theme.v4.colors.secondary.default,
      }}
    >
      {formatMessage({ id: cancelButtonText })}
    </SecondaryButton>
  );
};
