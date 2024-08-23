import React from 'react';
import styles from './CommunityCover.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { BackButton } from '~/v4/social/elements/BackButton';
import { CommunityProfileMenuButton } from '~/v4/social/elements/CommunityProfileMenuButton';

interface CommunityCoverProps {
  pageId?: string;
  componentId?: string;
  image?: string;
  onBack?: () => void;
  onClickMenu?: () => void;
}

export const CommunityCover: React.FC<CommunityCoverProps> = ({
  pageId = '*',
  componentId = '*',
  image,
  onBack,
  onClickMenu,
}) => {
  const elementId = 'community_cover';
  const { isExcluded, accessibilityId, themeStyles, config } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const backgroundStyle = image
    ? { backgroundImage: `url(${image})` }
    : { background: 'linear-gradient(180deg, #a5a9b5 0%, #636878 100%)' };

  if (isExcluded) return null;

  return (
    <div
      className={styles.communityCover__container}
      data-qa-anchor={accessibilityId}
      style={{
        ...themeStyles,
        ...backgroundStyle,
      }}
    >
      <div
        style={{
          ...backgroundStyle,
        }}
      />
      <div className={styles.communityCover__topBar}>
        <BackButton defaultClassName={styles.communityCover__backButton} onPress={onBack} />
        <CommunityProfileMenuButton
          className={styles.communityCover__menuButton}
          onClick={onClickMenu}
        />
      </div>
    </div>
  );
};
