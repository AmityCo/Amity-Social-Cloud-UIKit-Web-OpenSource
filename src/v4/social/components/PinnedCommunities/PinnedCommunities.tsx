import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useImage } from '~/v4/core/hooks/useImage';
import { Carousel } from '~/v4/core/components/Carousel';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityCardImage } from '~/v4/social/elements/CommunityCardImage';
import { CommunityMembersCount } from '~/v4/social/elements/CommunityMembersCount/CommunityMembersCount';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge/CommunityPrivateBadge';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName/CommunityDisplayName';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge/CommunityOfficialBadge';
import styles from './PinnedCommunities.module.css';

type PinnedCommunityCardProps = {
  pageId: string;
  componentId: string;
  community: Amity.Community;
  /**
   * `hero` renders a single full-width banner card (used when there is exactly
   * one pinned community); `carousel` renders the compact card used inside the
   * horizontal list. Neither variant shows a join/joined action button —
   * pinned membership is auto-managed and meant to feel permanent.
   */
  variant: 'hero' | 'carousel';
  onClick: (communityId: string) => void;
  onCategoryClick?: (categoryId: string) => void;
};

const PinnedCommunityCard = ({
  pageId,
  componentId,
  community,
  variant,
  onClick,
  onCategoryClick,
}: PinnedCommunityCardProps) => {
  const isHero = variant === 'hero';
  const avatarUrl = useImage({
    fileId: community.avatarFileId,
    imageSize: isHero ? 'large' : 'medium',
  });

  // Categories row renders only when the community actually has categories.
  const hasCategories = (community.categoryIds?.length ?? 0) > 0;

  return (
    <div
      className={clsx(styles.pinnedCommunityCard, isHero && styles.pinnedCommunityCard__hero)}
      onClick={() => onClick(community.communityId)}
      role="button"
      tabIndex={0}
    >
      <div
        className={clsx(
          styles.pinnedCommunityCard__imageWrapper,
          isHero && styles.pinnedCommunityCard__imageWrapper__hero,
        )}
      >
        <CommunityCardImage
          pageId={pageId}
          imgSrc={avatarUrl}
          componentId={componentId}
          className={clsx(
            styles.pinnedCommunityCard__image,
            isHero && styles.pinnedCommunityCard__image__hero,
          )}
        />
      </div>
      <div
        className={clsx(
          styles.pinnedCommunityCard__content,
          isHero && styles.pinnedCommunityCard__content__hero,
        )}
      >
        <div className={styles.pinnedCommunityCard__title}>
          {!community.isPublic && (
            <CommunityPrivateBadge pageId={pageId} componentId={componentId} />
          )}
          <CommunityDisplayName pageId={pageId} componentId={componentId} community={community} />
          {community.isOfficial && (
            <CommunityOfficialBadge pageId={pageId} componentId={componentId} />
          )}
        </div>
        {hasCategories && (
          <CommunityCategories
            truncate
            pageId={pageId}
            community={community}
            maxCategoriesLength={2}
            componentId={componentId}
            onClick={onCategoryClick}
            className={styles.pinnedCommunityCard__category}
          />
        )}
        <CommunityMembersCount
          pageId={pageId}
          componentId={componentId}
          memberCount={community.membersCount}
        />
      </div>
    </div>
  );
};

interface PinnedCommunitiesProps {
  pageId?: string;
}

export const PinnedCommunities = ({ pageId = '*' }: PinnedCommunitiesProps) => {
  const componentId = 'pinned_communities';
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const { goToCommunitiesByCategoryPage, goToCommunityProfilePage } = useNavigation();
  const { pinnedCommunities, noPinnedCommunities, fetchPinnedCommunities } = useExplore();

  useEffect(() => {
    fetchPinnedCommunities();
  }, []);

  // The whole section (title + cards) is hidden when there are no pinned
  // communities — no empty state. The title is rendered by ExploreComponent,
  // guarded by the same flag.
  if (noPinnedCommunities || pinnedCommunities.length === 0) return null;

  const isSingle = pinnedCommunities.length === 1;

  // Single pinned community → a full-width hero card (no carousel, no gap).
  if (isSingle) {
    return (
      <div style={themeStyles} data-testid={accessibilityId} className={styles.pinnedCommunities}>
        <PinnedCommunityCard
          variant="hero"
          pageId={pageId}
          componentId={componentId}
          community={pinnedCommunities[0]}
          onClick={(communityId) => goToCommunityProfilePage(communityId)}
          onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
        />
      </div>
    );
  }

  // Multiple pinned communities → horizontal carousel of compact cards.
  return (
    <Carousel
      scrollOffset={400}
      iconClassName={styles.pinnedCommunityCard__arrowIcon}
      isHidden={pinnedCommunities.length < 3}
      leftArrowClassName={clsx(styles.pinnedCommunityCard__arrow, styles.left)}
      rightArrowClassName={clsx(styles.pinnedCommunityCard__arrow, styles.right)}
    >
      <div style={themeStyles} data-testid={accessibilityId} className={styles.pinnedCommunities}>
        {pinnedCommunities.map((community) => (
          <PinnedCommunityCard
            variant="carousel"
            pageId={pageId}
            community={community}
            componentId={componentId}
            key={community.communityId}
            onClick={(communityId) => goToCommunityProfilePage(communityId)}
            onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
          />
        ))}
      </div>
    </Carousel>
  );
};
