import React, { useState } from 'react';
import { JoinRequestStatusEnum, JoinResultStatusEnum } from '@amityco/ts-sdk';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { useImage } from '~/v4/core/hooks/useImage';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { CommunityRowImage } from '~/v4/social/elements/CommunityRowImage/CommunityRowImage';
import { CommunityJoinButton } from '~/v4/social/elements/CommunityJoinButton/CommunityJoinButton';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName/CommunityDisplayName';
import { CommunityMembersCount } from '~/v4/social/elements/CommunityMembersCount/CommunityMembersCount';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge/CommunityPrivateBadge';
import { CommunityJoinedButton } from '~/v4/social/elements/CommunityJoinedButton/CommunityJoinedButton';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge/CommunityOfficialBadge';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import styles from './CommunityRowItem.module.css';
import Clock from '~/v4/icons/Clock';
import { IconButton } from '~/v4/core/components/IconButton';

import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNetworkState } from 'react-use';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useExplore } from '~/v4/social/providers/ExploreProvider';

type CommunityRowItemProps<TShowJoinButton extends boolean | undefined> = {
  community: Amity.Community;
  pageId?: string;
  componentId?: string;
  elementId?: string;
  order?: number;
  minCategoryCharacters?: number;
  maxCategoryCharacters?: number;
  maxCategoriesLength?: number;
  showJoinButton?: TShowJoinButton;
  onClick: (communityId: string) => void;
  onCategoryClick: (categoryId: string) => void;
  joinRequest?: Amity.JoinRequest;
  onPendingButtonClick?: () => void;
  onJoinSuccess?: (community: Amity.Community, data?: Amity.JoinResult) => void;
  onLeaveSuccess?: (community: Amity.Community) => void;
};

const formatOrder = (order: number) => (order < 10 ? `0${order}` : `${order}`);

export const CommunityRowItem = <T extends boolean | undefined>({
  order,
  onClick,
  community,
  pageId = '*',
  showJoinButton,
  onCategoryClick,
  elementId = '*',
  onPendingButtonClick,
  componentId = '*',
  maxCategoriesLength,
  maxCategoryCharacters,
  minCategoryCharacters,
  joinRequest,
  onJoinSuccess,
  onLeaveSuccess,
}: CommunityRowItemProps<T>) => {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });
  const avatarUrl = useImage({ fileId: community.avatarFileId, imageSize: 'medium' });
  const { confirm } = useConfirmContext();
  const { online } = useNetworkState();
  const [isPendingLocal, setIsPendingLocal] = useState(false);
  const [isCancelJoinRequestSuccess, setIsCancelJoinRequestSuccess] = useState(false);

  const { removePendingJoinCommunity, setPendingJoinCommunity } = useExplore();

  const { joinCommunity, leaveCommunity, cancelJoinCommunity } = useCommunityActions({
    joinRequest,
    community,
    // handle pending join state
    onJoinSuccess: ({ data }: { data?: Amity.JoinResult }) => {
      if (data?.status === JoinResultStatusEnum.Pending) {
        setIsPendingLocal(true);
      }
      onJoinSuccess?.(community, data);
    },
    // handle cancel join state
    onCancelJoinSuccess: () => {
      setIsCancelJoinRequestSuccess(true);
      setIsPendingLocal(false);
    },
    onLeaveSuccess: () => {
      onLeaveSuccess?.(community);
      return true;
    },
    onLeaveSuccess: () => true,
  });
  const notification = useNotifications();

  // Check if there's a pending join request from props or if we have local pending state
  const isPendingJoinRequest =
    joinRequest?.status === JoinRequestStatusEnum.Pending && !isCancelJoinRequestSuccess;

  const handleLeaveButtonClick = (community: Amity.Community) => {
    if (!online) {
      notification.info({
        content: 'Failed to leave community. Please try again.',
      });
      return;
    }

    if (community.requiresJoinApproval) {
      return confirm({
        title: 'Leave Community',
        content: "If you change your mind, you'll have to request to join again.",
        onOk: () => leaveCommunity(community),
        okText: 'Leave',
      });
    }

    leaveCommunity(community);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      style={themeStyles}
      key={community.communityId}
      className={styles.communityRowItem}
      onClick={() => onClick(community.communityId)}
      data-has-categories={community.categoryIds.length > 0}
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
            <CommunityPrivateBadge pageId={pageId} componentId={componentId} />
          )}
          <CommunityDisplayName pageId={pageId} componentId={componentId} community={community} />
          {community.isOfficial && (
            <CommunityOfficialBadge pageId={pageId} componentId={componentId} />
          )}
        </div>
        {community.categoryIds.length > 0 && (
          <CommunityCategories
            truncate
            pageId={pageId}
            community={community}
            componentId={componentId}
            onClick={onCategoryClick}
            maxCategoriesLength={maxCategoriesLength}
            minCategoryCharacters={minCategoryCharacters}
            maxCategoryCharacters={maxCategoryCharacters}
          />
        )}
        <CommunityMembersCount
          pageId={pageId}
          componentId={componentId}
          memberCount={community.membersCount}
        />
      </div>
      {!!showJoinButton &&
        (() => {
          if (community?.isJoined) {
            return (
              <CommunityJoinedButton
                pageId={pageId}
                componentId={componentId}
                className={styles.communityRowItem__joinButton}
                data-has-categories={community.categoryIds.length > 0}
                onClick={() => handleLeaveButtonClick(community)}
              />
            );
          } else if (isPendingJoinRequest || isPendingLocal) {
            return (
              <IconButton
                size="small"
                color="secondary"
                variant="outlined"
                defaultIcon={<Clock className={styles.communityRowItem__pendingButton} />}
                onPress={() => onPendingButtonClick?.() ?? cancelJoinCommunity()}
                text="Pending"
                className={styles.communityRowItem__pendingButtonWrapper}
              />
            );
          } else {
            return (
              <CommunityJoinButton
                pageId={pageId}
                componentId={componentId}
                className={styles.communityRowItem__joinButton}
                data-has-categories={community.categoryIds.length > 0}
                onClick={() => {
                  if (!online) {
                    notification.info({
                      content: 'Failed to join community. Please try again.',
                    });
                    return;
                  }
                  joinCommunity(community);
                }}
              />
            );
          }
        })()}
    </div>
  );
};
