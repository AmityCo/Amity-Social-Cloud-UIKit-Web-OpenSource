import React from 'react';
import Lock from '~/v4/icons/Lock';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { BackButton } from '~/v4/social/elements/BackButton';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import { CommunityProfileMenuButton } from '~/v4/social/elements/CommunityProfileMenuButton';
import styles from './CommunityCover.module.css';

type CommunityCoverProps = {
  image?: string;
  pageId?: string;
  isSticky?: boolean;
  onBack?: () => void;
  componentId?: string;
  onClickMenu?: () => void;
  community?: Amity.Community;
};

export const CommunityCover: React.FC<CommunityCoverProps> = ({
  image,
  onBack,
  isSticky,
  community,
  onClickMenu,
  pageId = '*',
  componentId = '*',
}) => {
  const elementId = 'community_cover';

  const { isExcluded, accessibilityId, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  const communityCoverStyle = {
    '--background-image': image
      ? `url(${image})`
      : 'linear-gradient(188deg, #A5A9B5 6.23%, #898E9E 93.77%)',
  };

  return (
    <div
      data-testid={accessibilityId}
      className={styles.communityCover}
      style={{ ...themeStyles, ...communityCoverStyle }}
    >
      <div className={styles.communityCover__topBar} data-scroll={isSticky}>
        <div className={styles.communityCover__topBarLeft}>
          <BackButton
            onPress={onBack}
            className={styles.communityCover__backButton}
            defaultClassName={styles.communityCover__backButton__icon}
          />
          {isSticky && (
            <>
              {!community?.isPublic && <Lock className={styles.communityCover__privateIcon} />}
              <Typography.TitleBold className={styles.communityCover__communityName}>
                {community?.displayName}
              </Typography.TitleBold>
              {community?.isOfficial && <CommunityOfficialBadge />}
            </>
          )}
        </div>
        {community?.isJoined && <CommunityProfileMenuButton onPress={onClickMenu} />}
      </div>
    </div>
  );
};
