import React from 'react';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { Illustration } from '~/v4/social/elements/Illustration';
import { Description } from '~/v4/social/elements/Description';
import { Title } from '~/v4/social/elements/Title';
import { ExploreCommunitiesButton } from '~/v4/social/elements/ExploreCommunitiesButton';
import { CreateCommunityButton } from '~/v4/social/elements/CreateCommunityButton';

import styles from './EmptyNewsFeed.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';

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

  if (isExcluded) return null;

  return (
    <div className={styles.emptyNewsfeed} style={themeStyles} data-testid={accessibilityId}>
      <Illustration pageId={pageId} componentId={componentId} />
      <div className={styles.emptyNewsfeed__text}>
        <Title pageId={pageId} componentId={componentId} />
        <Description pageId={pageId} componentId={componentId} />
      </div>
      <ExploreCommunitiesButton pageId={pageId} componentId={componentId} />
      <CreateCommunityButton
        pageId={pageId}
        componentId={componentId}
        onClick={() => goToCreateCommunityPage?.({ mode: AmityCommunitySetupPageMode.CREATE })}
      />
    </div>
  );
}
