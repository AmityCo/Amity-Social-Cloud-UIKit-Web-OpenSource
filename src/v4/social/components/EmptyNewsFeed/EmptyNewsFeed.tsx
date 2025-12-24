import React from 'react';
import { Illustration } from '~/v4/social/elements/Illustration';
import { Description } from '~/v4/social/elements/Description';
import { Title } from '~/v4/social/elements/Title';
import { ExploreCommunitiesButton } from '~/v4/social/elements/ExploreCommunitiesButton';
import { CreateCommunityButton } from '~/v4/social/elements/CreateCommunityButton';
import styles from './EmptyNewsFeed.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';
import { Divider } from '~/v4/social/elements/Divider';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { PostComposer } from '~/v4/social/components/PostComposer';

interface EmptyNewsfeedProps {
  pageId?: string;
}

export function EmptyNewsfeed({ pageId = '*' }: EmptyNewsfeedProps) {
  const componentId = 'empty_newsfeed';

  const { goToCreateCommunityPage } = useNavigation();

  const { isExcluded, themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  const { isDesktop } = useResponsive();

  if (isExcluded) return null;

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <Divider isShown={!isDesktop} />
      <div className={styles.emptyNewsfeed__storyTab}>
        <StoryTab type="globalFeed" pageId={pageId} />
      </div>
      <Divider isShown={!isDesktop} />
      <PostComposer pageId={pageId} />
      <div className={styles.emptyNewsfeed}>
        <Illustration pageId={pageId} componentId={componentId} />
        <div className={styles.emptyNewsfeed__text}>
          <Title
            pageId={pageId}
            componentId={componentId}
            titleClassName={styles.emptyNewsfeed__title}
          />
          <Description pageId={pageId} componentId={componentId} />
        </div>
        <ExploreCommunitiesButton pageId={pageId} componentId={componentId} />
        <CreateCommunityButton
          pageId={pageId}
          componentId={componentId}
          onClick={() => goToCreateCommunityPage?.({ mode: AmityCommunitySetupPageMode.CREATE })}
        />
      </div>
    </div>
  );
}
