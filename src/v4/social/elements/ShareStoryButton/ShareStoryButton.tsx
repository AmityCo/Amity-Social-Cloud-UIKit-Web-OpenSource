import React from 'react';

import Avatar from '~/core/components/Avatar';
import { useIntl } from 'react-intl';
import { isValidHttpUrl } from '~/utils';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { Icon } from '~/v4/core/components/Icon';
import styles from './ShareStoryButton.module.css';

interface ShareButtonProps {
  onClick: () => void;
  pageId: 'create_story_page';
  componentId: '*';
  avatar?: string;
  style?: React.CSSProperties;
  'data-qa-anchor'?: string;
}

export const ShareStoryButton = ({
  pageId = 'create_story_page',
  componentId = '*',
  onClick,
  avatar,
}: ShareButtonProps) => {
  const elementId = 'share_story_button';
  const { formatMessage } = useIntl();
  const { getConfig, isExcluded } = useCustomization();
  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/${elementId}`);

  if (isElementExcluded) return null;

  const shareIcon = elementConfig?.share_icon;
  const isRemoteImage = shareIcon && isValidHttpUrl(shareIcon);

  return (
    <button
      role="button"
      className={styles.uiShareStoryButton}
      data-qa-anchor="share_story_button"
      onClick={onClick}
    >
      {!elementConfig?.hide_avatar && (
        <Avatar data-qa-anchor="share_story_button_image_view" size="small" avatar={avatar} />
      )}
      <span>{formatMessage({ id: 'storyDraft.button.shareStory' })}</span>
      {isRemoteImage ? (
        <img src={shareIcon} alt="Share Story Icon" className={styles.remoteImageIcon} />
      ) : (
        <Icon className={styles.shareStoryIcon} name={'ArrowRight2Icon'} />
      )}
    </button>
  );
};
