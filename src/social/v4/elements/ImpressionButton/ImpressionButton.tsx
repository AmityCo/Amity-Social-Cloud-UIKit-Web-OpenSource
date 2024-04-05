import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { RemoteImageButton } from './styles';
import { isValidHttpUrl } from '~/utils';
import { EyeIcon } from '~/icons';

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
  const elementId = 'story_impression_button';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);

  const impressionIcon = elementConfig?.impression_icon;

  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const isRemoteImage = impressionIcon && isValidHttpUrl(impressionIcon);

  return isRemoteImage ? (
    <RemoteImageButton data-qa-anchor="reach_button" src={impressionIcon} onClick={onClick} />
  ) : (
    <EyeIcon data-qa-anchor="reach_button" width={20} height={20} onClick={onClick} />
  );
};
