import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { UIBackButtonImage } from './styles';
import { isValidHttpUrl } from '~/utils';
import { ActionButton } from '../ActionButton';
import { ArrowLeftCircle, ArrowLeftCircle2 } from '~/icons';

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
}: BackButtonProps) => {
  const elementId = 'back_button';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const backIcon = elementConfig?.back_icon;

  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const isRemoteImage = backIcon && isValidHttpUrl(backIcon);

  return isRemoteImage ? (
    <UIBackButtonImage data-qa-anchor="back_button" src={backIcon} onClick={onClick} />
  ) : (
    <ActionButton
      data-qa-anchor="back_button"
      icon={
        backIcon === 'back' ? (
          <ArrowLeftCircle2 width={20} height={20} />
        ) : (
          <ArrowLeftCircle width={20} height={20} />
        )
      }
      onClick={onClick}
    />
  );
};
