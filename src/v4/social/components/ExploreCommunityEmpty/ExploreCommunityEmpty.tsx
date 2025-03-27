import React from 'react';
import { Title } from '~/v4/social/elements/Title/Title';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { ExploreEmptyImage } from '~/v4/social/elements/ExploreEmptyImage';
import { Description } from '~/v4/social/elements/Description/Description';
import { ExploreCreateCommunity } from '~/v4/social/elements/ExploreCreateCommunity/ExploreCreateCommunity';
import styles from './ExploreCommunityEmpty.module.css';

type ExploreCommunityEmptyProps = {
  pageId?: string;
};

export function ExploreCommunityEmpty({ pageId = '*' }: ExploreCommunityEmptyProps) {
  const componentId = 'explore_community_empty';

  const { goToCreateCommunityPage } = useNavigation();
  const { themeStyles, accessibilityId } = useAmityComponent({ componentId, pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.exploreCommunityEmpty}>
      <ExploreEmptyImage pageId={pageId} componentId={componentId} />
      <div className={styles.exploreCommunityEmpty__text}>
        <Title pageId={pageId} componentId={componentId} />
        <Description pageId={pageId} componentId={componentId} />
      </div>
      <ExploreCreateCommunity
        pageId={pageId}
        componentId={componentId}
        onClick={() => goToCreateCommunityPage?.({ mode: AmityCommunitySetupPageMode.CREATE })}
      />
    </div>
  );
}
