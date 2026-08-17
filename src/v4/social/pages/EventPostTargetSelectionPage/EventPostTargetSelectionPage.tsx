import React, { useEffect, useRef, useState } from 'react';
import { useString, resolveString } from '~/v4/core/localization';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { Title } from '~/v4/social/elements/Title/Title';
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
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import useSDK from '~/v4/core/hooks/useSDK';
import { Mode, PostComposerPage } from '~/v4/social/pages/PostComposerPage/';
import { Button } from '~/v4/core/natives/Button';
import { canCreatePostCommunity } from '~/v4/social/utils';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { PrivateEventBanner } from '~/v4/social/elements/PrivateEventBanner';
import styles from './EventPostTargetSelectionPage.module.css';

export type EventPostTargetSelectionPageProps = {
  event: Amity.Event;
};

const isPrivateEvent = (event: Amity.Event): boolean => {
  return event.originType === 'community' && event.isOriginPublic === false;
};

export function EventPostTargetSelectionPage({ event }: EventPostTargetSelectionPageProps) {
  const pageId = 'event_post_target_selection_page';

  const { onBack } = useNavigation();
  const { isDesktop } = useResponsive();
  const { confirm } = useConfirmContext();
  const { client, currentUserId } = useSDK();
  const { themeStyles, config } = useAmityPage({ pageId });
  const { openPopup, closePopup } = usePopupContext();
  const { user } = useUser({ userId: currentUserId });
  const { AmityEventPostTargetSelectionPageBehavior } = usePageBehavior();
  const { canBeDiscarded } = useLayoutContext();
  const canBeDiscardedRef = useRef(canBeDiscarded);
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { communities, hasMore, loadMore, isLoading } = useCommunitiesCollection({
    queryParams: { limit: 20, membership: 'member' },
  });

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && !isLoading) loadMore();
    },
    options: { threshold: 0.7 },
  });

  useEffect(() => {
    canBeDiscardedRef.current = canBeDiscarded;
  }, [canBeDiscarded]);

  const eventIsPrivate = isPrivateEvent(event);
  const myTimelineLabel = useString('amity_social_button_my_communities');
  const titleKey = 'amity_social_label_select_event_post_target_title';

  const openComposerPopup = ({
    community,
    targetId,
    targetType,
    targetName,
  }: {
    community?: Amity.Community;
    targetId: string | null;
    targetType: 'community' | 'user';
    targetName?: string;
  }) => {
    if (isDesktop) {
      openPopup({
        pageId: 'post_composer_page',
        view: 'desktop',
        isDismissable: false,
        onClose: () => {
          if (canBeDiscardedRef.current) {
            closePopup();
          } else {
            confirm({
              type: 'confirm',
              onOk: closePopup,
              okText: resolveString('amity_social_modal_dialog_discard_button'),
              cancelText: resolveString('amity_social_button_keep_editing'),
              title: resolveString('amity_social_modal_dialog_title_discard_post'),
              pageId: 'post_composer_page',
              content: resolveString('amity_social_modal_dialog_discard_post'),
            });
          }
        },
        header: (
          <CommunityDisplayName
            community={community}
            displayName={targetName}
            pageId="post_composer_page"
            className={styles.eventPostTargetSelectionPage__displayName}
          />
        ),
        children: (
          <PostComposerPage
            mode={Mode.CREATE}
            community={community}
            targetType={targetType}
            targetId={targetId}
            targetName={targetName}
            event={event}
          />
        ),
      });
    } else {
      AmityEventPostTargetSelectionPageBehavior?.goToPostComposerPage?.({
        mode: Mode.CREATE,
        community,
        targetType,
        targetId,
        targetName,
        event,
      });
    }
  };

  return (
    <div
      className={styles.eventPostTargetSelectionPage}
      style={{
        ...themeStyles,
        ...(typeof config.background_color === 'string' && config.background_color
          ? { backgroundColor: config.background_color }
          : {}),
      }}
    >
      <div className={styles.eventPostTargetSelectionPage__topBar}>
        <CloseButton
          pageId={pageId}
          onPress={() => (isDesktop ? closePopup() : onBack())}
          imgClassName={styles.eventPostTargetSelectionPage__closeButton}
        />
        <Title
          pageId={pageId}
          titleClassName={styles.eventPostTargetSelectionPage__title}
          textKey={titleKey}
        />
        <div />
      </div>

      {eventIsPrivate && (
        <PrivateEventBanner className={styles.eventPostTargetSelectionPage__banner} />
      )}

      {!eventIsPrivate && (
        <>
          <div className={styles.eventPostTargetSelectionPage__timelineContainer}>
            <Button
              className={styles.eventPostTargetSelectionPage__timeline}
              onPress={() =>
                openComposerPopup({
                  community: undefined,
                  targetId: null,
                  targetType: 'user',
                })
              }
            >
              <MyTimelineAvatar pageId={pageId} userId={user?.userId} />
              <MyTimelineText pageId={pageId} />
            </Button>
          </div>
          <div className={styles.eventPostTargetSelectionPage__line} />
        </>
      )}

      <div className={styles.eventPostTargetSelectionPage__myCommunities}>{myTimelineLabel}</div>
      <div className={styles.eventPostTargetSelectionPage__myCommunitiesList}>
        {communities
          .filter((community) => canCreatePostCommunity(client, community))
          .filter((community) => (eventIsPrivate ? community.communityId === event.originId : true))
          .map((community) => (
            <Button
              key={community.communityId}
              className={styles.eventPostTargetSelectionPage__timeline}
              data-testid="event-post-target-community-item"
              onPress={() =>
                openComposerPopup({
                  community,
                  targetId: community.communityId,
                  targetType: 'community',
                  targetName: community.displayName,
                })
              }
            >
              <div className={styles.eventPostTargetSelectionPage__communityAvatar}>
                <CommunityAvatar pageId={pageId} community={community} />
              </div>
              <div className={styles.eventPostTargetSelectionPage__communityName}>
                {!community.isPublic && <CommunityPrivateBadge />}
                <CommunityDisplayName pageId={pageId} community={community} />
                {community.isOfficial && <CommunityOfficialBadge />}
              </div>
            </Button>
          ))}
      </div>
      <div
        ref={(node) => setIntersectionNode(node)}
        className={styles.eventPostTargetSelectionPage__intersectionObserver}
      />
    </div>
  );
}

export default EventPostTargetSelectionPage;
