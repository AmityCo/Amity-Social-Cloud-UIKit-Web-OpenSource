import { Button } from '~/v4/core/natives/Button';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { EventSetupMode } from '~/v4/social/features';
import { Title } from '~/v4/social/elements/Title/Title';
import { canCreatePostCommunity } from '~/v4/social/utils';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import { useEventTargetSelection } from './hooks/useEventTargetSelection';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import styles from './EventTargetSelection.module.css';
import { EmptyTargetSelection } from '~/v4/social/components/EmptyTargetSelection';

export function EventTargetSelection() {
  const {
    pageId,
    client,
    onBack,
    closePopup,
    communities,
    themeStyles,
    setIntersectionNode,
    isLoading,
  } = useEventTargetSelection();
  const { AmityEventTargetSelectionPageBehavior } = usePageBehavior();
  const myCommunitiesLabel = useString('amity_social_button_my_communities');

  return (
    <div className={styles.eventTargetSelection} style={themeStyles}>
      <div className={styles.eventTargetSelection__topBar}>
        <CloseButton pageId={pageId} onPress={() => onBack()} />
        <Title
          pageId={pageId}
          titleClassName={styles.eventTargetSelection__title}
          textKey="amity_social_label_select_event_target_title"
        />
        <div />
      </div>
      <Typography.Body className={styles.eventTargetSelection__myCommunities}>
        {myCommunitiesLabel}
      </Typography.Body>
      {communities.filter((community) => canCreatePostCommunity(client, community)).length === 0 &&
        !isLoading && <EmptyTargetSelection />}
      {communities
        .filter((community) => canCreatePostCommunity(client, community))
        .map((community) => {
          return (
            <Button
              key={community.communityId}
              data-testid={`community.${community.communityId}`}
              className={styles.eventTargetSelection__timeline}
              onPress={() => {
                closePopup();
                AmityEventTargetSelectionPageBehavior?.goToEventSetupPage?.({
                  mode: EventSetupMode.CREATE,
                  targetId: community.communityId,
                  targetName: community.displayName,
                });
              }}
            >
              <div className={styles.eventTargetSelection__communityAvatar}>
                <CommunityAvatar pageId={pageId} community={community} />
              </div>
              <div className={styles.eventTargetSelection__communityName}>
                {!community.isPublic && <CommunityPrivateBadge />}
                <CommunityDisplayName pageId={pageId} community={community} />
                {community.isOfficial && <CommunityOfficialBadge />}
              </div>
            </Button>
          );
        })}
      <div
        ref={(node) => setIntersectionNode(node)}
        className={styles.eventTargetSelection__intersectionObserver}
      />
    </div>
  );
}
