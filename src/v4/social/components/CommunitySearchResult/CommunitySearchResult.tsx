import React, { useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { CommunityRowItem } from '~/v4/social/internal-components/CommunityRowItem';
import { EmptySearchResult } from '~/v4/social/internal-components/EmptySearchResult';
import { CommunityRowItemSkeleton } from '~/v4/social/internal-components/CommunityRowItem/CommunityRowItemSkeleton';
import styles from './CommunitySearchResult.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { useNetworkState } from 'react-use';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

type CommunitySearchResultProps = {
  pageId?: string;
  isLoading: boolean;
  onLoadMore: () => void;
  showJoinButton?: boolean;
  onClosePopover?: () => void;
  communityCollection: Amity.Community[];
};

export const CommunitySearchResult = ({
  isLoading,
  onLoadMore,
  pageId = '*',
  onClosePopover,
  showJoinButton = false,
  communityCollection = [],
}: CommunitySearchResultProps) => {
  const componentId = 'community_search_result';

  const { isDesktop } = useResponsive();
  const { joinCommunity, leaveCommunity } = useCommunityActions();
  const { themeStyles, accessibilityId } = useAmityComponent({ pageId, componentId });
  const { online } = useNetworkState();
  const notification = useNotifications();
  const { goToCommunityProfilePage, goToCommunitiesByCategoryPage } = useNavigation();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { confirm } = useConfirmContext();

  useIntersectionObserver({ onIntersect: () => onLoadMore(), node: intersectionNode });

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.communitySearchResult}>
      <NoInternetConnectionHoc
        page="global-search"
        className={styles.communitySearchResult__noInternetConnectionHoc}
      >
        {communityCollection.length > 0 &&
          communityCollection.map((community) => (
            <CommunityRowItem
              pageId={pageId}
              community={community}
              componentId={componentId}
              maxCategoryCharacters={24}
              key={community.communityId}
              showJoinButton={showJoinButton}
              maxCategoriesLength={isDesktop ? 2 : 5}
              onJoinButtonClick={(community) => {
                if (!online) {
                  notification.info({
                    content: 'Failed to join community. Please try again.',
                  });
                  return;
                }
                joinCommunity(community);
              }}
              onLeaveButtonClick={(community) => {
                if (!online) {
                  notification.info({
                    content: 'Failed to leave community. Please try again.',
                  });
                  return;
                }
                if (community.requiresJoinApproval) {
                  confirm({
                    title: 'Leave Community',
                    content: 'If you change your mind, you’ll have to request to join again.',
                    onOk: () => leaveCommunity(community),
                  });
                  return;
                }
                leaveCommunity(community);
              }}
              onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
              onClick={(communityId) => {
                onClosePopover?.();
                goToCommunityProfilePage(communityId);
              }}
            />
          ))}
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <CommunityRowItemSkeleton key={index} pageId={pageId} componentId={componentId} />
            ))
          : null}
        {!isLoading && communityCollection.length === 0 && <EmptySearchResult />}
      </NoInternetConnectionHoc>
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
