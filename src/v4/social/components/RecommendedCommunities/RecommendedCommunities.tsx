import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useImage } from '~/v4/core/hooks/useImage';
import { Button } from '~/v4/core/components/AriaButton';
import { Carousel } from '~/v4/core/components/Carousel';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';
import { CommunityCardImage } from '~/v4/social/elements/CommunityCardImage';
import { RecommendedCommunityCardSkeleton } from './RecommendedCommunityCardSkeleton';
import { CommunityJoinButton } from '~/v4/social/elements/CommunityJoinButton/CommunityJoinButton';
import { CommunityMembersCount } from '~/v4/social/elements/CommunityMembersCount/CommunityMembersCount';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge/CommunityPrivateBadge';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName/CommunityDisplayName';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge/CommunityOfficialBadge';
import { CommunityJoinedButton } from '~/v4/social/elements/CommunityJoinedButton/CommunityJoinedButton';
import styles from './RecommendedCommunities.module.css';
import { useNetworkState } from 'react-use';
import { resolveString } from '~/v4/core/localization';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useGetJoinRequestList } from '~/v4/social/hooks/useGetJoinRequestList';
import useSDK from '~/v4/core/hooks/useSDK';

type RecommendedCommunityCardProps = {
  pageId: string;
  componentId: string;
  community: Amity.Community;
  onClick: (communityId: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  onJoinButtonClick: (community: Amity.Community) => void;
  onLeaveButtonClick: (community: Amity.Community) => void;
};

const RecommendedCommunityCard = ({
  pageId,
  onClick,
  community,
  componentId,
  onCategoryClick,
  onJoinButtonClick,
  onLeaveButtonClick,
}: RecommendedCommunityCardProps) => {
  const avatarUrl = useImage({ fileId: community.avatarFileId, imageSize: 'medium' });

  return (
    <div
      className={styles.recommendedCommunityCard}
      onClick={() => onClick(community.communityId)}
      role="button"
      tabIndex={0}
    >
      <div className={styles.recommendedCommunityCard__imageWrapper}>
        <CommunityCardImage
          pageId={pageId}
          imgSrc={avatarUrl}
          componentId={componentId}
          className={styles.recommendedCommunityCard__image}
        />
      </div>
      <div className={styles.recommendedCommunityCard__content}>
        <div className={styles.recommendedCommunities__contentTitle}>
          {!community.isPublic && (
            <CommunityPrivateBadge pageId={pageId} componentId={componentId} />
          )}
          <CommunityDisplayName pageId={pageId} componentId={componentId} community={community} />
          {community.isOfficial && (
            <CommunityOfficialBadge pageId={pageId} componentId={componentId} />
          )}
        </div>
        <div className={styles.recommendedCommunityCard__bottom}>
          <div className={styles.recommendedCommunityCard__content__left}>
            <CommunityCategories
              truncate
              pageId={pageId}
              community={community}
              maxCategoriesLength={2}
              componentId={componentId}
              onClick={onCategoryClick}
              className={styles.recommendedCommunityCard__category}
            />
            <CommunityMembersCount
              pageId={pageId}
              componentId={componentId}
              memberCount={community.membersCount}
            />
          </div>
          <div className={styles.recommendedCommunities__content__right}>
            {community.isJoined ? (
              <CommunityJoinedButton
                pageId={pageId}
                componentId={componentId}
                onClick={() => onLeaveButtonClick(community)}
              />
            ) : (
              <CommunityJoinButton
                pageId={pageId}
                componentId={componentId}
                onClick={() => onJoinButtonClick(community)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface RecommendedCommunitiesProps {
  pageId?: string;
}

export const RecommendedCommunities = ({ pageId = '*' }: RecommendedCommunitiesProps) => {
  const componentId = 'recommended_communities';
  const { isVisitorOrBot } = useSDK();

  const MAX_DISPLAYED_COMMUNITIES = 5;
  const FETCH_BUFFER_SIZE = 10; // Fetch more to account for filtering

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  const { online } = useNetworkState();
  const notification = useNotifications();
  const { goToCommunitiesByCategoryPage, goToCommunityProfilePage } = useNavigation();

  const {
    recommendedCommunities,
    isLoading,
    fetchRecommendedCommunities,
    refetchRecommendedCommunities,
    refreshBothCommunityCollections,
    pendingJoinCommunities,
    setPendingJoinCommunity,
    removePendingJoinCommunity,
    priorityRecommendedCommunities,
    addPriorityRecommendedCommunity,
    removePriorityRecommendedCommunity,
  } = useExplore();

  const communityIds = recommendedCommunities
    .map((community) => community.communityId)
    .filter((id) => !pendingJoinCommunities.includes(id));

  const { joinRequestList } = useGetJoinRequestList({ communityIds, enabled: !isVisitorOrBot });

  // First, filter out communities with pending join requests
  const availableCommunities = joinRequestList
    ? recommendedCommunities.filter(
        (community) =>
          !joinRequestList.some(
            (request) => request.targetId === community.communityId && request.status === 'pending',
          ) && !pendingJoinCommunities.includes(community.communityId),
      )
    : recommendedCommunities.filter(
        (community) => !pendingJoinCommunities.includes(community.communityId),
      );

  // Separate priority communities (those that were in trending and became available again)
  const priorityCommunities = availableCommunities.filter((community) =>
    priorityRecommendedCommunities.includes(community.communityId),
  );

  // Get other available communities (not in priority list)
  const otherCommunities = availableCommunities.filter(
    (community) => !priorityRecommendedCommunities.includes(community.communityId),
  );

  // Combine priority communities first, then fill with others to reach MAX_DISPLAYED_COMMUNITIES
  const finalCommunities = [...priorityCommunities, ...otherCommunities].slice(
    0,
    MAX_DISPLAYED_COMMUNITIES,
  );

  // If we have fewer than MAX_DISPLAYED_COMMUNITIES and more communities are available,
  // try to fetch more (this is handled by the increased buffer size in ExploreProvider)
  const recommendedCommunitiesWithOutJoinRequests = finalCommunities;

  useEffect(() => {
    fetchRecommendedCommunities();
  }, []);

  const { joinCommunity, leaveCommunity } = useCommunityActions({
    onJoinSuccess: ({ data, communityId }: { data?: Amity.JoinResult; communityId?: string }) => {
      if (data?.status === 'pending' && communityId) {
        setPendingJoinCommunity(communityId);
      }

      refreshBothCommunityCollections();
    },
    onLeaveSuccess: () => {
      refreshBothCommunityCollections();
    },
  });

  const handleJoinButtonClick = async (community: Amity.Community) => {
    if (!online) {
      notification.info({
        content: resolveString('amity_social_toast_snackbar_join_community_failed'),
      });
      return;
    }
    joinCommunity(community);
  };

  const handleLeaveButtonClick = (community: Amity.Community) => {
    if (!online) {
      notification.info({
        content: resolveString('amity_social_toast_leave_community_failed'),
      });
      return;
    }
    // Remove from pending list before leaving
    removePendingJoinCommunity(community.communityId);
    leaveCommunity(community);
  };

  return (
    <Carousel
      scrollOffset={400}
      iconClassName={styles.recommendedCommunityCard__arrowIcon}
      isHidden={isLoading || recommendedCommunitiesWithOutJoinRequests.length < 3}
      leftArrowClassName={clsx(styles.recommendedCommunityCard__arrow, styles.left)}
      rightArrowClassName={clsx(styles.recommendedCommunityCard__arrow, styles.right)}
    >
      <div
        style={themeStyles}
        data-testid={accessibilityId}
        className={styles.recommendedCommunities}
      >
        {isLoading
          ? Array.from({ length: MAX_DISPLAYED_COMMUNITIES }).map((_, index) => (
              <RecommendedCommunityCardSkeleton key={index} />
            ))
          : recommendedCommunitiesWithOutJoinRequests.length === 0
            ? null
            : recommendedCommunitiesWithOutJoinRequests
                .slice(0, MAX_DISPLAYED_COMMUNITIES)
                .map((community) => (
                  <RecommendedCommunityCard
                    pageId={pageId}
                    community={community}
                    componentId={componentId}
                    key={community.communityId}
                    onJoinButtonClick={(community) => handleJoinButtonClick(community)}
                    onLeaveButtonClick={(community) => handleLeaveButtonClick(community)}
                    onClick={(communityId) => goToCommunityProfilePage(communityId)}
                    onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
                  />
                ))}
      </div>
    </Carousel>
  );
};
