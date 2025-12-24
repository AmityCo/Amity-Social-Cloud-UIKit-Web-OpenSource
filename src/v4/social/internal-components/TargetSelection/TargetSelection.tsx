import React, { useState } from 'react';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { MyTimelineAvatar } from '~/v4/social/elements/MyTimelineAvatar';
import { MyTimelineText } from '~/v4/social/elements/MyTimelineText';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import useCommunitiesCollection from '~/v4/social/hooks/collections/useCommunitiesCollection';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import useSDK from '~/v4/core/hooks/useSDK';
import { Button } from '~/v4/core/natives/Button';
import { canCreatePostCommunity } from '~/v4/social/utils';
import styles from './TargetSelection.module.css';
import { CommunitySmallListItemSkeleton } from '~/v4/social/internal-components/Skeleton';

export type SelectedTarget = { targetId: string | null; targetType: Amity.PostTargetType };

export type TargetSelectionProps = {
  testIdPrefix: string;
  pageId?: string;
  onSelectTarget: (params: SelectedTarget) => void;
};

export function TargetSelection({
  pageId = '*',
  testIdPrefix,
  onSelectTarget,
}: TargetSelectionProps) {
  const { client } = useSDK();
  const { themeStyles } = useAmityPage({
    pageId,
  });
  const { onBack } = useNavigation();
  const { communities, hasMore, loadMore, isLoading } = useCommunitiesCollection({
    queryParams: { limit: 20, membership: 'member' },
  });

  const { currentUserId } = useSDK();
  const { user } = useUser({ userId: currentUserId });

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
    options: {
      threshold: 0.7,
    },
    node: intersectionNode,
  });

  return (
    <div className={styles.targetSelection} style={themeStyles}>
      <div className={styles.targetSelection__timelineContainer}>
        <Button
          className={styles.targetSelection__timeline}
          onPress={() => onSelectTarget({ targetType: 'user', targetId: null })}
        >
          <MyTimelineAvatar pageId={pageId} userId={user?.userId} />
          <MyTimelineText pageId={pageId} />
        </Button>
      </div>
      <div className={styles.targetSelection__line} />
      <div className={styles.targetSelection__myCommunities}>My Communities</div>
      <div className={styles.targetSelection__myCommunitiesList}>
        {communities
          .filter((community) => canCreatePostCommunity(client, community))
          .map((community) => {
            return (
              <Button
                key={community.communityId}
                className={styles.targetSelection__communityItem}
                data-testid={`${testIdPrefix}-target-selection-community-item`}
                onPress={() =>
                  onSelectTarget({
                    targetType: 'community',
                    targetId: community.communityId,
                  })
                }
              >
                <div className={styles.targetSelection__communityAvatar}>
                  <CommunityAvatar pageId={pageId} community={community} />
                </div>
                <div className={styles.targetSelection__communityName}>
                  {!community.isPublic && <CommunityPrivateBadge />}
                  <CommunityDisplayName pageId={pageId} community={community} />
                  {community.isOfficial && <CommunityOfficialBadge />}
                </div>
              </Button>
            );
          })}
        {isLoading && (
          <div className={styles.targetSelection__skeletonWrapper}>
            {Array.from({ length: 3 }).map((_, index) => (
              <CommunitySmallListItemSkeleton key={index} />
            ))}
          </div>
        )}
      </div>
      <div
        ref={(node) => setIntersectionNode(node)}
        className={styles.targetSelection__intersectionObserver}
      />
    </div>
  );
}
