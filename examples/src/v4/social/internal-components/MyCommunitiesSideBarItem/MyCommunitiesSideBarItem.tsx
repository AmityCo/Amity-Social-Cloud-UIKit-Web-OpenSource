import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName/CommunityDisplayName';
import { CommunityMembersCount } from '~/v4/social/elements/CommunityMembersCount/CommunityMembersCount';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge/CommunityPrivateBadge';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge/CommunityOfficialBadge';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import styles from './MyCommunitiesSideBarItem.module.css';

type MyCommunitiesSideBarItemProps = {
  pageId?: string;
  elementId?: string;
  componentId?: string;
  isSelected?: boolean;
  community: Amity.Community;
  maxCategoriesLength?: number;
  minCategoryCharacters?: number;
  maxCategoryCharacters?: number;
  onClick: (communityId: string) => void;
  onCategoryClick: (categoryId: string) => void;
};

export const MyCommunitiesSideBarItem = ({
  onClick,
  community,
  isSelected,
  pageId = '*',
  elementId = '*',
  onCategoryClick,
  componentId = '*',
  maxCategoriesLength,
  maxCategoryCharacters,
  minCategoryCharacters,
}: MyCommunitiesSideBarItemProps) => {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  return (
    <Button
      style={themeStyles}
      data-selected={isSelected}
      className={styles.myCommunitiesSideBarItem}
      onPress={() => onClick(community.communityId)}
      data-has-categories={community.categoryIds.length > 0}
    >
      <div className={styles.myCommunitiesSideBarItem__image}>
        <CommunityAvatar
          pageId={pageId}
          community={community}
          componentId={componentId}
          className={styles.myCommunitiesSideBarItem__imageIcon}
        />
      </div>
      <div className={styles.myCommunitiesSideBarItem__content}>
        <div className={styles.myCommunitiesSideBarItem__communityName} data-selected={isSelected}>
          {!community.isPublic && (
            <CommunityPrivateBadge
              pageId={pageId}
              componentId={componentId}
              className={styles.myCommunitiesSideBarItem__communityName__privateIcon}
            />
          )}
          <CommunityDisplayName
            pageId={pageId}
            community={community}
            componentId={componentId}
            className={styles.myCommunitiesSideBarItem__communityDisplayName}
          />
          {community.isOfficial && (
            <CommunityOfficialBadge
              pageId={pageId}
              componentId={componentId}
              className={styles.myCommunitiesSideBarItem__communityName__officialBadge}
            />
          )}
        </div>
        <CommunityCategories
          truncate
          pageId={pageId}
          community={community}
          componentId={componentId}
          onClick={onCategoryClick}
          maxCategoriesLength={maxCategoriesLength}
          minCategoryCharacters={minCategoryCharacters}
          maxCategoryCharacters={maxCategoryCharacters}
          className={styles.myCommunitiesSideBarItem__categories}
        />
        <div className={styles.myCommunitiesSideBarItem__member}>
          <CommunityMembersCount
            pageId={pageId}
            componentId={componentId}
            memberCount={community.membersCount}
          />
        </div>
      </div>
    </Button>
  );
};
