import React, { useEffect, useState } from 'react';
import { useNetworkState } from 'react-use';
import { Typography } from '~/v4/core/components';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { InvitationStatusEnum } from '@amityco/ts-sdk';
import { BackButton, Title } from '~/v4/social/elements';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { NoInternet } from '~/v4/social/internal-components/NoInternet';
import { EmptyResult } from '~/v4/social/internal-components/EmptyResult';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { SearchResultSkeleton } from '~/v4/social/internal-components/SearchResultSkeleton/SearchResultSkeleton';
import styles from './CommunityPendingInvitationPage.module.css';

type CommunityPendingInvitationPageProps = {
  community: Amity.Community;
};

function useCommunityPendingInvitationPage({ community }: CommunityPendingInvitationPageProps) {
  const pageId = 'community_pending_invitation_page';

  const { onBack } = useNavigation();
  const { online } = useNetworkState();
  const { isDesktop } = useResponsive();
  const { AmityCommunityPendingInvitationPageBehavior } = usePageBehavior();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const {
    hasMore,
    isLoading,
    loadMore,
    items: invitations,
    refresh,
  } = useLiveCollection<
    Amity.Invitation,
    Pick<Amity.InvitationLiveCollection, 'limit' | 'sortBy' | 'statuses'>
  >({
    fetcher: (params, callback) => community!.getMemberInvitations(params, callback),
    params: { limit: 20, statuses: [InvitationStatusEnum.Pending] },
    shouldCall: !!community,
  });

  useEffect(() => {
    refresh();
  }, []);

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && isLoading === false) loadMore();
    },
  });

  const onAvatarClick = (userId: string) => {
    AmityCommunityPendingInvitationPageBehavior?.goToUserProfilePage?.({ userId });
  };

  const isEmpty = online && invitations.length === 0 && !isLoading;

  const isFetching = isLoading && online;

  return {
    onBack,
    pageId,
    isEmpty,
    isDesktop,
    isFetching,
    invitations,
    themeStyles,
    onAvatarClick,
    accessibilityId,
    isOnline: online,
    intersectionNode,
    setIntersectionNode,
  };
}

export function CommunityPendingInvitationPage(props: CommunityPendingInvitationPageProps) {
  const {
    pageId,
    onBack,
    isEmpty,
    isOnline,
    isFetching,
    invitations,
    themeStyles,
    onAvatarClick,
    accessibilityId,
    setIntersectionNode,
  } = useCommunityPendingInvitationPage(props);

  return (
    <section
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.communityPendingInvitationPage}
    >
      <div className={styles.communityPendingInvitationPage__topBar}>
        <BackButton onPress={() => onBack()} pageId={pageId} />
        <Title titleClassName={styles.communityPendingInvitationPage__title} pageId={pageId} />
        <div className={styles.communityPendingInvitationPage__emptySpace} />
      </div>
      <div className={styles.communityPendingInvitationPage__members}>
        {!isOnline && (
          <div
            data-selected={invitations.length > 0}
            className={styles.communityPendingInvitationPage__state}
          >
            <NoInternet pageId={pageId} />
          </div>
        )}
        {isEmpty && (
          <div
            data-selected={invitations.length > 0}
            className={styles.communityPendingInvitationPage__state}
          >
            <EmptyResult pageId={pageId} />
          </div>
        )}
        {isOnline &&
          invitations.map((invitation) => (
            <div
              key={invitation.invitationId}
              className={styles.communityPendingInvitationPage__member}
            >
              <UserAvatar
                userId={invitation.user?.userId}
                className={styles.communityPendingInvitationPage__memberAvatar}
                textPlaceholderClassName={styles.communityPendingInvitationPage__memberAvatar}
                onPressAvatar={() =>
                  invitation.user?.userId && onAvatarClick(invitation.user?.userId)
                }
              />
              <Typography.BodyBold className={styles.communityPendingInvitationPage__memberName}>
                {invitation.user?.displayName ?? invitation.userId}
              </Typography.BodyBold>
            </div>
          ))}
        {isFetching && (
          <div className={styles.communityPendingInvitationPage__skeleton}>
            {Array.from({ length: 5 }).map((_, index) => (
              <SearchResultSkeleton key={index} pageId={pageId} />
            ))}
          </div>
        )}
        <div ref={(node) => setIntersectionNode(node)} />
      </div>
    </section>
  );
}
