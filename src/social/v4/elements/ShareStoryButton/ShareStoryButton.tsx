import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { ShareStoryIcon, UIShareStoryButton, RemoteImageIcon } from './styles';
import Avatar from '~/core/components/Avatar';
import { useIntl } from 'react-intl';
import { isValidHttpUrl } from '~/utils';
import { useTheme } from 'styled-components';

interface ShareButtonProps {
  onClick: () => void;
  pageId: 'create_story_page';
  componentId: '*';
  avatar?: string;
  style?: React.CSSProperties;
}

export const ShareStoryButton = ({
  pageId = 'create_story_page',
  componentId = '*',
  onClick,
  avatar,
  style,
}: ShareButtonProps) => {
  const theme = useTheme();
  const elementId = 'share_story_button';
  const { formatMessage } = useIntl();
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const shareIcon = elementConfig?.share_icon;
  const isRemoteImage = shareIcon && isValidHttpUrl(shareIcon);

  return (
    <UIShareStoryButton
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: elementConfig?.background_color || theme.v4.colors.primary.default,
      }}
    >
      {!elementConfig?.hide_avatar && <Avatar size="small" avatar={avatar} />}
      <span>{formatMessage({ id: 'storyDraft.button.shareStory' })}</span>
      {isRemoteImage ? (
        <RemoteImageIcon src={shareIcon} />
      ) : (
        <ShareStoryIcon name={shareIcon === 'share_story_button' ? 'ArrowRight2Icon' : shareIcon} />
      )}
    </UIShareStoryButton>
  );
};
