import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { EmptyPinnedPost } from '~/v4/social/components/EmptyPinnedPost';
import styles from './CommunityPin.module.css';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import LockPrivateContent from '~/v4/social/internal-components/LockPrivateContent';

interface CommunityPinProps {
  pageId?: string;
  communityId: string;
}

export const CommunityPin = ({ pageId = '*', communityId }: CommunityPinProps) => {
  const componentId = 'community_pin';
  const { accessibilityId, themeStyles, isExcluded } = useAmityComponent({
    pageId,
    componentId,
  });

  if (isExcluded) return null;

  const { community } = useCommunity({ communityId, shouldCall: !!communityId });

  const isMemberPrivateCommunity = community?.isJoined && !community?.isPublic;

  //TODO : Integrate with the new pinned post API
  //TODO : Fix condition to show empty pinned post and lock private content

  return (
    <div
      data-qa-anchor={accessibilityId}
      className={styles.communityPin__container}
      style={themeStyles}
    >
      {isMemberPrivateCommunity || community?.isPublic ? (
        <EmptyPinnedPost />
      ) : (
        <LockPrivateContent />
      )}
    </div>
  );
};
