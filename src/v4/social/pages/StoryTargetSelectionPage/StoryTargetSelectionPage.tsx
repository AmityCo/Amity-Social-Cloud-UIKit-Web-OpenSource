import React, { useEffect, useRef, useState } from 'react';
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

export function StoryTargetSelectionPage() {
  const pageId = 'select_story_target_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });
  const { onBack } = useNavigation();
  const { communities, hasMore, loadMore, isLoading } = useCommunitiesCollection({
    queryParams: { sortBy: 'displayName', limit: 20, membership: 'member' },
  });
  const { AmityStoryTargetSelectionPage } = usePageBehavior();
  const { file, setFile } = useStoryContext();
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

  const renderCommunity = communities.map((community) => {
    return (
      <FileTrigger key={community.communityId} onSelect={handleFileSelect}>
        <Button onPress={() => handleOnClickCommunity(community.communityId)}>
          <div className={styles.selectStoryTargetPage__myCommunities}>
            <div className={styles.selectStoryTargetPage__communityAvatar}>
              <CommunityAvatar pageId={pageId} community={community} />
            </div>
            <CommunityDisplayName pageId={pageId} community={community} />
            <div>
              {community.isOfficial && <CommunityOfficialBadge />}
              {!community.isPublic && <CommunityPrivateBadge />}
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
    }
  }, [file]);

  return (
    <div className={styles.selectStoryTargetPage} style={themeStyles}>
      <div className={styles.selectStoryTargetPage__topBar}>
        <CloseButton
          imgClassName={styles.selectStoryTargetPage__closeButton}
          pageId={pageId}
          onPress={onBack}
        />
        <Title pageId={pageId} titleClassName={styles.selectStoryTargetPage__title} />
        <div />
      </div>
      <div className={styles.selectStoryTargetPage__line} />
      <div className={styles.selectStoryTargetPage__myCommunities}>My Communities</div>
      <div className={styles.selectStoryTargetPage__myCommunities__container}>
        {renderCommunity}
      </div>
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
}
