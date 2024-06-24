import React from 'react';
import useCategoriesByIds from '~/social/hooks/useCategoriesByIds';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';
import { CommunityCategoryName } from '~/v4/social/elements/CommunityCategoryName';
import { CommunityMembersCount } from '~/v4/social/elements/CommunityMembersCount';
import styles from './CommunityItem.module.css';

const CommunityCategories = ({
  community,
  pageId,
  componentId,
}: {
  community: Amity.Community;
  pageId: string;
  componentId: string;
}) => {
  const categories = useCategoriesByIds(community.categoryIds);

  const maxCategoriesLength = 3;

  const overflowCategoriesLength = categories.length - maxCategoriesLength;

  return (
    <>
      {categories.slice(0, 3).map((category) => (
        <CommunityCategoryName
          pageId={pageId}
          componentId={componentId}
          categoryName={category.name}
        />
      ))}
      {overflowCategoriesLength > 0 && (
        <CommunityCategoryName
          pageId={pageId}
          componentId={componentId}
          categoryName={`+${overflowCategoriesLength}`}
        />
      )}
    </>
  );
};

export const CommunityItem = ({
  community,
  pageId = '*',
  componentId = '*',
}: {
  community: Amity.Community;
  pageId: string;
  componentId: string;
}) => {
  return (
    <div key={community.communityId} className={styles.communityItem}>
      <div className={styles.communityItem__leftPane}>
        <CommunityAvatar pageId={pageId} componentId={componentId} community={community} />
      </div>
      <div className={styles.communityItem__rightPane}>
        <div className={styles.communityItem__communityName}>
          {!community.isPublic && (
            <div className={styles.communityItem__communityName__private}>
              <CommunityPrivateBadge pageId={pageId} componentId={componentId} />
            </div>
          )}
          <CommunityDisplayName pageId={pageId} componentId={componentId} community={community} />
          {community.isOfficial && (
            <CommunityOfficialBadge pageId={pageId} componentId={componentId} />
          )}
        </div>
        <div className={styles.communityItem__communityCategory}>
          <CommunityCategories pageId={pageId} componentId={componentId} community={community} />
        </div>
        <div className={styles.communityItem__communityMemberCount}>
          <CommunityMembersCount
            pageId={pageId}
            componentId={componentId}
            memberCount={community.membersCount}
          />
        </div>
      </div>
    </div>
  );
};
