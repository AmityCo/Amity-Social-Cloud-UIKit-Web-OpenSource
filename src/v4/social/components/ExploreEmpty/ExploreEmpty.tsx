import React from 'react';
import { Title } from '~/v4/social/elements/Title/Title';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Description } from '~/v4/social/elements/Description/Description';
import { ExploreCreateCommunity } from '~/v4/social/elements/ExploreCreateCommunity/ExploreCreateCommunity';
import { ExploreEmptyImage } from '~/v4/social/elements/ExploreEmptyImage/ExploreEmptyImage';
import styles from './ExploreEmpty.module.css';

type ExploreEmptyProps = {
  pageId?: string;
};

export function ExploreEmpty({ pageId = '*' }: ExploreEmptyProps) {
  const componentId = 'explore_empty';

  const { goToCreateCommunityPage } = useNavigation();
  const { themeStyles, accessibilityId } = useAmityComponent({ componentId, pageId });

  return (
    <div className={styles.exploreEmpty} style={themeStyles} data-testid={accessibilityId}>
      <ExploreEmptyImage pageId={pageId} componentId={componentId} />
      <div className={styles.exploreEmpty__text}>
        <Title
          pageId={pageId}
          componentId={componentId}
          textKey="amity_social_empty_state_explore_empty"
        />
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
