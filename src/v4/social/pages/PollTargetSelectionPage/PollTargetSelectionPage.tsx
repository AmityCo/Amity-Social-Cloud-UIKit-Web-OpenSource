import React, { useState } from 'react';
import styles from './PollTargetSelectionPage.module.css';
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
import useSDK from '~/v4/core/hooks/useSDK';
import { Button } from '~/v4/core/natives/Button';
import { canCreatePostCommunity } from '~/v4/social/utils';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { PollTypeSelection } from '~/v4/social/components/PollTypeSelection';
import { Typography } from '~/v4/core/components';

export function PollTargetSelectionPage() {
  const { client } = useSDK();
  const pageId = 'select_poll_target_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });
  const { onBack } = useNavigation();
  const { communities, hasMore, loadMore, isLoading } = useCommunitiesCollection({
    queryParams: { limit: 20, membership: 'member' },
  });

  const { currentUserId } = useSDK();
  const { user } = useUser({ userId: currentUserId });
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { setDrawerData, removeDrawerData } = useDrawer();

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
    node: intersectionNode,
  });

  return (
    <div className={styles.pollTargetSelectionPage} style={themeStyles}>
      <div className={styles.pollTargetSelectionPage__topBar}>
        <CloseButton
          pageId={pageId}
          onPress={() => onBack()}
          imgClassName={styles.pollTargetSelectionPage__closeButton}
        />
        <Title pageId={pageId} titleClassName={styles.pollTargetSelectionPage__title} />
        <div />
      </div>
      <div className={styles.pollTargetSelectionPage__timelineContainer}>
        <Button
          className={styles.pollTargetSelectionPage__timeline}
          onPress={() => {
            isDesktop
              ? openPopup({
                  pageId,
                  view: 'desktop',
                  isDismissable: false,
                  header: <Typography.Headline>Choose poll type</Typography.Headline>,
                  children: ({ close }) => (
                    <PollTypeSelection targetId={null} targetType="user" onClickNext={close} />
                  ),
                })
              : setDrawerData({
                  content: (
                    <PollTypeSelection
                      targetId={null}
                      targetType="user"
                      onClickNext={removeDrawerData}
                    />
                  ),
                });
          }}
        >
          <MyTimelineAvatar pageId={pageId} userId={user?.userId} />
          <MyTimelineText pageId={pageId} />
        </Button>
      </div>
      <div className={styles.pollTargetSelectionPage__line} />
      <div className={styles.pollTargetSelectionPage__myCommunities}>My Communities</div>
      {communities
        .filter((community) => canCreatePostCommunity(client, community))
        .map((community) => {
          return (
            <Button
              key={community.communityId}
              className={styles.pollTargetSelectionPage__timeline}
              onPress={() => {
                isDesktop
                  ? openPopup({
                      pageId,
                      view: 'desktop',
                      isDismissable: false,
                      header: <Typography.Headline>Choose poll type</Typography.Headline>,
                      children: ({ close }) => (
                        <PollTypeSelection
                          onClickNext={close}
                          targetType="community"
                          target={community}
                          targetId={community.communityId}
                        />
                      ),
                    })
                  : setDrawerData({
                      content: (
                        <PollTypeSelection
                          target={community}
                          targetId={community.communityId}
                          targetType="community"
                          onClickNext={removeDrawerData}
                        />
                      ),
                    });
              }}
            >
              <div className={styles.pollTargetSelectionPage__communityAvatar}>
                <CommunityAvatar pageId={pageId} community={community} />
              </div>
              <div className={styles.pollTargetSelectionPage__communityName}>
                {!community.isPublic && <CommunityPrivateBadge />}
                <CommunityDisplayName pageId={pageId} community={community} />
                {community.isOfficial && <CommunityOfficialBadge />}
              </div>
            </Button>
          );
        })}
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
}
