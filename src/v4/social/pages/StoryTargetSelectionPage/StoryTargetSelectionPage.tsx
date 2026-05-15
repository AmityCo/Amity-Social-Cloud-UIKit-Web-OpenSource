import React, { useEffect, useRef, useState } from 'react';
import { useString } from '~/v4/core/localization';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { Title } from '~/v4/social/elements/Title/Title';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import useCommunitiesCollection from '~/v4/social/hooks/collections/useCommunitiesCollection';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { FileTrigger } from 'react-aria-components';
import { Button } from '~/v4/core/natives/Button';

import styles from './StoryTargetSelectionPage.module.css';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { Typography } from '~/v4/core/components';
import { CommunitySmallListSekeleton } from '~/v4/core/components/CommunitySmallListSekeleton/CommunitySmallListSekeleton';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { canCreatePostCommunity } from '~/v4/social/utils';
import useSDK from '~/v4/core/hooks/useSDK';

export function StoryTargetSelectionPage() {
  const pageId = 'select_story_target_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });
  const { onBack } = useNavigation();
  const { closePopup } = usePopupContext();
  const { communities, hasMore, loadMore, isLoading } = useCommunitiesCollection({
    queryParams: { limit: 20, membership: 'member' },
  });
  const { AmityStoryTargetSelectionPage } = usePageBehavior();
  const { file, setFile } = useStoryContext();
  const { client } = useSDK();

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);

  const handleOnClickCommunity = (communityId: string) => {
    setSelectedCommunityId(communityId);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0 && selectedCommunityId) {
      setFile(files[0]);
    }
  };

  const renderSkeleton = () => {
    return (
      <div className={styles.selectStoryTargetPage__skeletonContainer}>
        {Array.from({ length: 7 }).map((_, index) => {
          return <CommunitySmallListSekeleton key={index} />;
        })}
      </div>
    );
  };

  const renderCommunity = communities
    .filter((community) => canCreatePostCommunity(client, community))
    .map((community) => {
      return (
        <FileTrigger key={community.communityId} onSelect={handleFileSelect}>
          <Button
            onPress={() => handleOnClickCommunity(community.communityId)}
            data-testid="story-target-community-item"
          >
            <div className={styles.selectStoryTargetPage__communityItem_container}>
              <div className={styles.selectStoryTargetPage__communityAvatar}>
                <CommunityAvatar pageId={pageId} community={community} />
              </div>
              <div className={styles.selectStoryTargetPage__communityName}>
                {!community.isPublic && <CommunityPrivateBadge />}
                <CommunityDisplayName pageId={pageId} community={community} />
                {community.isOfficial && <CommunityOfficialBadge />}
              </div>
            </div>
          </Button>
        </FileTrigger>
      );
    });

  useIntersectionObserver({
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
    options: {
      threshold: 0.7,
    },
    node: intersectionNode,
  });

  useEffect(() => {
    if (file) {
      AmityStoryTargetSelectionPage?.goToStoryCreationPage?.({
        targetId: selectedCommunityId,
        targetType: 'community',
        mediaType:
          file && file?.type.includes('image')
            ? { type: 'image', url: URL.createObjectURL(file) }
            : { type: 'video', url: URL.createObjectURL(file!) },
        storyType: 'globalFeed',
      });

      closePopup();
    }
  }, [file]);

  return (
    <div className={styles.selectStoryTargetPage} style={themeStyles}>
      <div className={styles.selectStoryTargetPage__topBar}>
        <CloseButton
          imgClassName={styles.selectStoryTargetPage__closeButton}
          pageId={pageId}
          onPress={() => onBack()}
        />
        <Title
          pageId={pageId}
          titleClassName={styles.selectStoryTargetPage__title}
          textKey="amity_social_button_post_to"
        />
        <div />
      </div>

      <Typography.Body className={styles.selectStoryTargetPage__myCommunities_text}>
        {useString('amity_social_button_my_communities')}
      </Typography.Body>
      <div className={styles.selectStoryTargetPage__myCommunities__container}>
        {renderCommunity}
        {isLoading && renderSkeleton()}
      </div>
      <div
        ref={(node) => setIntersectionNode(node)}
        className={styles.selectStoryTargetPage__intersectionObserver}
      />
    </div>
  );
}
