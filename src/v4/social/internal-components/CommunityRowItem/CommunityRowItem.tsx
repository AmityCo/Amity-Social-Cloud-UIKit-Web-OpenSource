import React from 'react';

import { useAmityElement } from '~/v4/core/hooks/uikit';
import { CommunityJoinButton } from '~/v4/social/elements/CommunityJoinButton/CommunityJoinButton';
import { CommunityMembersCount } from '~/v4/social/elements/CommunityMembersCount/CommunityMembersCount';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge/CommunityPrivateBadge';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName/CommunityDisplayName';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge/CommunityOfficialBadge';
import { Typography } from '~/v4/core/components';
import { CommunityRowImage } from '~/v4/social/elements/CommunityRowImage/CommunityRowImage';
import { useImage } from '~/v4/core/hooks/useImage';
import { CommunityJoinedButton } from '~/v4/social/elements/CommunityJoinedButton/CommunityJoinedButton';

import styles from './CommunityRowItem.module.css';
import { ClickableArea } from '~/v4/core/natives/ClickableArea/ClickableArea';

type CommunityRowItemProps<TShowJoinButton extends boolean | undefined> = {
  community: Amity.Community;
  pageId?: string;
  componentId?: string;
  elementId?: string;
  key?: string;
  order?: number;
  minCategoryCharacters?: number;
  maxCategoryCharacters?: number;
  maxCategoriesLength?: number;
  showJoinButton?: TShowJoinButton;
  onClick: (communityId: string) => void;
  onCategoryClick: (categoryId: string) => void;
} & (TShowJoinButton extends true
  ? {
      onJoinButtonClick: (communityId: string) => void;
      onLeaveButtonClick: (communityId: string) => void;
    }
  : {
      onJoinButtonClick?: undefined | null;
      onLeaveButtonClick?: undefined | null;
    });

const formatOrder = (order: number) => {
  if (order < 10) {
    return `0${order}`;
  }
  return `${order}`;
};

export const CommunityRowItem = <T extends boolean | undefined>({
  key,
  pageId = '*',
  componentId = '*',
  elementId = '*',
  community,
  order,
  showJoinButton,
  minCategoryCharacters,
  maxCategoryCharacters,
  maxCategoriesLength,
  onJoinButtonClick,
  onLeaveButtonClick,
  onClick,
  onCategoryClick,
}: CommunityRowItemProps<T>) => {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const avatarUrl = useImage({ fileId: community.avatarFileId, imageSize: 'medium' });

  return (
    <ClickableArea
      key={key}
      elementType="div"
      className={styles.communityRowItem}
      onPress={() => onClick(community.communityId)}
      data-has-categories={community.categoryIds.length > 0}
      style={themeStyles}
    >
      <div className={styles.communityRowItem__image}>
        <CommunityRowImage pageId={pageId} componentId={componentId} imgSrc={avatarUrl} />
        {typeof order === 'number' ? (
          <Typography.BodyBold className={styles.communityRowItem__order}>
            {formatOrder(order)}
          </Typography.BodyBold>
        ) : null}
      </div>
      <div className={styles.communityRowItem__content}>
        <div className={styles.communityRowItem__communityName}>
          {!community.isPublic && (
            <div className={styles.communityRowItem__communityName__private}>
              <CommunityPrivateBadge pageId={pageId} componentId={componentId} />
            </div>
          )}
          <CommunityDisplayName pageId={pageId} componentId={componentId} community={community} />
          {community.isOfficial && (
            <CommunityOfficialBadge pageId={pageId} componentId={componentId} />
          )}
        </div>

        <div
          className={styles.communityRowItem__categories}
          data-show-join-button={showJoinButton === true}
        >
          <CommunityCategories
            pageId={pageId}
            componentId={componentId}
            community={community}
            maxCategoriesLength={maxCategoriesLength}
            onClick={onCategoryClick}
            minCategoryCharacters={minCategoryCharacters}
            maxCategoryCharacters={maxCategoryCharacters}
            truncate
          />
        </div>

        <div className={styles.communityRowItem__member}>
          <CommunityMembersCount
            pageId={pageId}
            componentId={componentId}
            memberCount={community.membersCount}
          />
        </div>
        {showJoinButton === true &&
          (community.isJoined ? (
            <CommunityJoinedButton
              pageId={pageId}
              componentId={componentId}
              className={styles.communityRowItem__joinButton}
              data-has-categories={community.categoryIds.length > 0}
              onClick={() => onLeaveButtonClick?.(community.communityId)}
            />
          ) : (
            <CommunityJoinButton
              pageId={pageId}
              componentId={componentId}
              className={styles.communityRowItem__joinButton}
              data-has-categories={community.categoryIds.length > 0}
              onClick={() => onJoinButtonClick?.(community.communityId)}
            />
          ))}
      </div>
    </ClickableArea>
  );
};
