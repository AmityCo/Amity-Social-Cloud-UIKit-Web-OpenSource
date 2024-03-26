import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { ActionButton, CustomActionButton } from './styles';
import { isValidHttpUrl } from '~/utils';
import { useTheme } from 'styled-components';

interface SpeakerButtonProps {
  pageId: 'story_page';
  componentId: '*';
  isMuted: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  'data-qa-anchor'?: string;
}

export const SpeakerButton = ({
  pageId = 'story_page',
  componentId = '*',
  isMuted = false,
  onClick = () => {},
  style,
  ...props
}: SpeakerButtonProps) => {
  const theme = useTheme();
  const elementId = 'speaker_button';
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const mutedIcon = elementConfig?.mute_icon;
  const unmutedIcon = elementConfig?.unmute_icon;

  const isMutedRemoteImage = mutedIcon && isValidHttpUrl(mutedIcon);
  const isUnmutedRemoteImage = unmutedIcon && isValidHttpUrl(unmutedIcon);

  return isMuted ? (
    isMutedRemoteImage ? (
      <CustomActionButton
        data-qa-anchor="video_audio_button"
        src={mutedIcon}
        onClick={onClick}
        style={{
          ...style,
          backgroundColor: elementConfig?.background_color || theme.v4.colors.base.default,
        }}
        {...props}
      />
    ) : (
      <ActionButton
        data-qa-anchor="video_audio_button"
        name={mutedIcon === 'mute' ? 'UnmuteCircle' : mutedIcon}
        onClick={onClick}
        style={{
          ...style,
          backgroundColor: elementConfig?.background_color || theme.v4.colors.base.default,
        }}
        {...props}
      />
    )
  ) : isUnmutedRemoteImage ? (
    <CustomActionButton
      data-qa-anchor="video_audio_button"
      src={unmutedIcon}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: elementConfig?.background_color || theme.v4.colors.base.default,
      }}
      {...props}
    />
  ) : (
    <ActionButton
      data-qa-anchor="video_audio_button"
      name={unmutedIcon === 'unmute' ? 'MuteCircle' : unmutedIcon}
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: elementConfig?.background_color || theme.v4.colors.base.default,
      }}
      {...props}
    />
  );
};
