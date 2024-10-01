import React, { useEffect } from 'react';

import styles from './RecommendedCommunities.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommunityJoinButton } from '~/v4/social/elements/CommunityJoinButton/CommunityJoinButton';
import { CommunityMembersCount } from '~/v4/social/elements/CommunityMembersCount/CommunityMembersCount';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge/CommunityPrivateBadge';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName/CommunityDisplayName';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge/CommunityOfficialBadge';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityCardImage } from '~/v4/social/elements/CommunityCardImage';
import useImage from '~/core/hooks/useImage';
import { RecommendedCommunityCardSkeleton } from './RecommendedCommunityCardSkeleton';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import { CommunityJoinedButton } from '~/v4/social/elements/CommunityJoinedButton/CommunityJoinedButton';
import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';
import { ClickableArea } from '~/v4/core/natives/ClickableArea/ClickableArea';

interface RecommendedCommunityCardProps {
  community: Amity.Community;
  pageId: string;
  componentId: string;
  onClick: (communityId: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  onJoinButtonClick: (communityId: string) => void;
  onLeaveButtonClick: (communityId: string) => void;
}

const RecommendedCommunityCard = ({
  pageId,
  componentId,
  community,
  onClick,
  onCategoryClick,
  onJoinButtonClick,
  onLeaveButtonClick,
}: RecommendedCommunityCardProps) => {
  const avatarUrl = useImage({
    fileId: community.avatarFileId,
    imageSize: 'medium',
  });

  return (
    <ClickableArea
      elementType="div"
      className={styles.recommendedCommunityCard}
      onPress={() => onClick(community.communityId)}
    >
      <div className={styles.recommendedCommunityCard__image}>
        <CommunityCardImage
          pageId={pageId}
          componentId={componentId}
          imgSrc={avatarUrl}
          className={styles.recommendedCommunityCard__img}
        />
      </div>
      <div className={styles.recommendedCommunityCard__content}>
        <div className={styles.recommendedCommunities__contentTitle}>
          {!community.isPublic && (
            <div className={styles.recommendedCommunityCard__communityName__private}>
              <CommunityPrivateBadge pageId={pageId} componentId={componentId} />
            </div>
          )}
          <CommunityDisplayName pageId={pageId} componentId={componentId} community={community} />
          {community.isOfficial && (
            <div className={styles.recommendedCommunityCard__communityName__official}>
              <CommunityOfficialBadge pageId={pageId} componentId={componentId} />
            </div>
          )}
        </div>
        <div className={styles.recommendedCommunityCard__bottom}>
          <div className={styles.recommendedCommunityCard__content__left}>
            <CommunityCategories
              pageId={pageId}
              componentId={componentId}
              community={community}
              onClick={onCategoryClick}
              truncate
              maxCategoryCharacters={5}
              maxCategoriesLength={2}
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
                onClick={() => onLeaveButtonClick(community.communityId)}
              />
            ) : (
              <CommunityJoinButton
                pageId={pageId}
                componentId={componentId}
                onClick={() => onJoinButtonClick(community.communityId)}
              />
            )}
          </div>
        </div>
      </div>
    </ClickableArea>
  );
};

interface RecommendedCommunitiesProps {
  pageId?: string;
}

export const RecommendedCommunities = ({ pageId = '*' }: RecommendedCommunitiesProps) => {
  const componentId = 'recommended_communities';
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { goToCommunitiesByCategoryPage, goToCommunityProfilePage } = useNavigation();

  const { recommendedCommunities, isLoading, fetchRecommendedCommunities } = useExplore();

  useEffect(() => {
    fetchRecommendedCommunities();
  }, []);

  const { joinCommunity, leaveCommunity } = useCommunityActions();

  const handleJoinButtonClick = (communityId: string) => joinCommunity(communityId);

  const handleLeaveButtonClick = (communityId: string) => leaveCommunity(communityId);

  if (isLoading) {
    return (
      <div className={styles.recommendedCommunities}>
        {[1, 2, 3, 4].map((index) => (
          <RecommendedCommunityCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (recommendedCommunities.length === 0) {
    return null;
  }

  return (
    <div
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.recommendedCommunities}
    >
      {recommendedCommunities.map((community) => (
        <RecommendedCommunityCard
          key={community.communityId}
          community={community}
          pageId={pageId}
          componentId={componentId}
          onClick={(communityId) => goToCommunityProfilePage(communityId)}
          onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
          onJoinButtonClick={handleJoinButtonClick}
          onLeaveButtonClick={handleLeaveButtonClick}
        />
      ))}
    </div>
  );
};
