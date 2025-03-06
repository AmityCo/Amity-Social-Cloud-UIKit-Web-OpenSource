import React, { useState } from 'react';
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
import styles from './SelectPostTargetPage.module.css';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

export function SelectPostTargetPage() {
  const pageId = 'select_post_target_page';

  const { onBack } = useNavigation();
  const { isDesktop } = useResponsive();
  const { confirm } = useConfirmContext();
  const { client, currentUserId } = useSDK();
  const { themeStyles } = useAmityPage({ pageId });
  const { openPopup, closePopup } = usePopupContext();
  const { user } = useUser({ userId: currentUserId });
  const { AmityPostTargetSelectionPage } = usePageBehavior();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { communities, hasMore, loadMore, isLoading } = useCommunitiesCollection({
    queryParams: { limit: 20, membership: 'member' },
  });

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && !isLoading) loadMore();
    },
  });

  return (
    <div className={styles.selectPostTargetPage} style={themeStyles}>
      <div className={styles.selectPostTargetPage__topBar}>
        <CloseButton
          pageId={pageId}
          onPress={() => onBack()}
          imgClassName={styles.selectPostTargetPage__closeButton}
        />
        <Title pageId={pageId} titleClassName={styles.selectPostTargetPage__title} />
        <div />
      </div>
      <div className={styles.selectPostTargetPage__timelineContainer}>
        <Button
          className={styles.selectPostTargetPage__timeline}
          onPress={() => {
            isDesktop
              ? openPopup({
                  pageId,
                  view: 'desktop',
                  isDismissable: false,
                  onClose: () => {
                    confirm({
                      type: 'confirm',
                      onOk: closePopup,
                      okText: 'Discard',
                      cancelText: 'Keep editing',
                      title: 'Discard this post?',
                      pageId: 'post_composer_page',
                      content: 'The post will be permanently discarded. It cannot be undone.',
                    });
                  },
                  header: (
                    <CommunityDisplayName
                      community={undefined}
                      pageId="post_composer_page"
                      className={styles.selectPostTargetPage__displayName}
                    />
                  ),
                  children: (
                    <PostComposerPage
                      targetId={null}
                      targetType="user"
                      mode={Mode.CREATE}
                      community={undefined}
                    />
                  ),
                })
              : AmityPostTargetSelectionPage?.goToPostComposerPage?.({
                  mode: Mode.CREATE,
                  targetId: null,
                  targetType: 'user',
                  community: undefined,
                });
          }}
        >
          <MyTimelineAvatar pageId={pageId} userId={user?.userId} />
          <MyTimelineText pageId={pageId} />
        </Button>
      </div>
      <div className={styles.selectPostTargetPage__line} />
      <div className={styles.selectPostTargetPage__myCommunities}>My Communities</div>
      <div className={styles.selectPostTargetPage__myCommunitiesList}>
        {communities
          .filter((community) => canCreatePostCommunity(client, community))
          .map((community) => {
            return (
              <Button
                key={community.communityId}
                className={styles.selectPostTargetPage__timeline}
                onPress={() => {
                  isDesktop
                    ? openPopup({
                        pageId,
                        view: 'desktop',
                        isDismissable: false,
                        onClose: ({ close }) => {
                          confirm({
                            onOk: close,
                            type: 'confirm',
                            okText: 'Discard',
                            cancelText: 'Keep editing',
                            title: 'Discard this post?',
                            pageId: 'post_composer_page',
                            content: 'The post will be permanently discarded. It cannot be undone.',
                          });
                        },
                        header: (
                          <CommunityDisplayName
                            community={community}
                            pageId="post_composer_page"
                            className={styles.selectPostTargetPage__displayName}
                          />
                        ),
                        children: (
                          <PostComposerPage
                            mode={Mode.CREATE}
                            community={community}
                            targetType="community"
                            targetId={community.communityId}
                          />
                        ),
                      })
                    : AmityPostTargetSelectionPage?.goToPostComposerPage?.({
                        mode: Mode.CREATE,
                        community: community,
                        targetType: 'community',
                        targetId: community.communityId,
                      });
                }}
              >
                <div className={styles.selectPostTargetPage__communityAvatar}>
                  <CommunityAvatar pageId={pageId} community={community} />
                </div>
                <div className={styles.selectPostTargetPage__communityName}>
                  {!community.isPublic && <CommunityPrivateBadge />}
                  <CommunityDisplayName pageId={pageId} community={community} />
                  {community.isOfficial && <CommunityOfficialBadge />}
                </div>
              </Button>
            );
          })}
      </div>
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
}
