import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Description } from '~/v4/social/elements/Description/Description';
import { ExploreCreateCommunity } from '~/v4/social/elements/ExploreCreateCommunity/ExploreCreateCommunity';
import { ExploreEmptyImage } from '~/v4/social/elements/ExploreEmptyImage/ExploreEmptyImage';
import { Title } from '~/v4/social/elements/Title/Title';

import styles from './ExploreEmpty.module.css';

interface ExploreEmptyProps {
  pageId?: string;
}

export function ExploreEmpty({ pageId = '*' }: ExploreEmptyProps) {
  const componentId = 'explore_empty';

  const { goToCommunityCreatePage } = useNavigation();

  const { themeStyles, accessibilityId } = useAmityComponent({
    componentId,
    pageId,
  });

  return (
    <div className={styles.exploreEmpty} style={themeStyles} data-qa-anchor={accessibilityId}>
      <ExploreEmptyImage pageId={pageId} componentId={componentId} />
      <div className={styles.exploreEmpty__text}>
        <Title pageId={pageId} componentId={componentId} />
        <Description pageId={pageId} componentId={componentId} />
      </div>
      <ExploreCreateCommunity
        pageId={pageId}
        componentId={componentId}
        onClick={goToCommunityCreatePage}
      />
    </div>
  );
}
