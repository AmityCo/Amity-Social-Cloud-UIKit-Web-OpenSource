import React from 'react';
import styles from './CommunityHeader.module.css';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import { Button } from '~/v4/core/components/AriaButton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { Typography } from '~/v4/core/components';

type ClipHeaderProps = {
  pageId?: string;
  componentId?: string;
  targetId: string;
  targetType: string;
};

export const ClipHeader = ({
  pageId = '*',
  componentId = '*',
  targetId,
  targetType,
}: ClipHeaderProps) => {
  const { AmityClipFeedPageBehavior } = usePageBehavior();

  const { community, isLoading: isCommunityLoading } = useCommunity({
    communityId: targetType === 'community' ? targetId : undefined,
  });

  const { user, isLoading: isUserLoading } = useUser({
    userId: targetType === 'user' ? targetId : undefined,
  });

  return (
    <div className={styles.clipHeader__container}>
      {targetType === 'community' ? (
        isCommunityLoading ? (
          <div className={styles.clipHeader__skeleton} />
        ) : (
          <Button
            variant="text"
            onPress={() => {
              AmityClipFeedPageBehavior?.goToCommunityProfilePage?.({ communityId: targetId });
            }}
            className={styles.clipHeader__button}
          >
            {!community?.isPublic && (
              <CommunityPrivateBadge
                pageId={pageId}
                componentId={componentId}
                className={styles.clipHeader__lockIcon}
              />
            )}
            <CommunityDisplayName
              pageId={pageId}
              componentId={componentId}
              community={community}
              className={styles.clipHeader__displayName}
            />
            {community?.isOfficial && (
              <CommunityOfficialBadge
                pageId={pageId}
                componentId={componentId}
                className={styles.clipHeader__officialBadgeIcon}
              />
            )}
          </Button>
        )
      ) : isUserLoading ? (
        <div className={styles.clipHeader__skeleton} />
      ) : (
        <Button
          variant="text"
          onPress={() => {
            AmityClipFeedPageBehavior?.goToUserProfilePage?.({ userId: targetId });
          }}
          className={styles.clipHeader__button}
        >
          <Typography.TitleBold className={styles.clipHeader__displayName}>
            {user?.displayName}
          </Typography.TitleBold>
        </Button>
      )}
    </div>
  );
};
