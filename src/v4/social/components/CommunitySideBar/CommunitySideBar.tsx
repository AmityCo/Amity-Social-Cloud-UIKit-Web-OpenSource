import clsx from 'clsx';
import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useConfig } from '~/v4/social/providers/ConfigProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunitySideBarTitle } from '~/v4/social/elements/CommunitySideBarTitle';
import { AmityCommunitySetupPageMode, SocialGlobalSearchPage } from '~/v4/social/pages';
import { MyCommunitiesSideBar } from '~/v4/social/internal-components/MyCommunitiesSideBar';
import { MyCommunitiesSideBarTitle } from '~/v4/social/elements/MyCommunitiesSideBarTitle';
import {
  ExploreMenuItem,
  NewsFeedMenuItem,
  CreateCommunityMenuItem,
} from '~/v4/social/elements/CommunitySideBarMenuItem';
import styles from './CommunitySideBar.module.css';

type CommunitySideBarProps = {
  pageId?: string;
  className?: string;
  isExploreHidden?: boolean;
};

export const CommunitySideBar = ({
  className,
  pageId = '*',
  isExploreHidden,
}: CommunitySideBarProps) => {
  const componentId = 'community_sidebar';
  const { goToCreateCommunityPage } = useNavigation();
  const { socialCommunityCreationButtonVisible } = useConfig();
  const { accessibilityId, themeStyles } = useAmityComponent({ componentId, pageId });

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.communitySideBar, className)}
    >
      <div className={styles.communitySideBar__header}>
        <CommunitySideBarTitle pageId={pageId} componentId={componentId} />
        <SocialGlobalSearchPage />
      </div>
      <div className={styles.communitySideBar__menuSection}>
        <NewsFeedMenuItem pageId={pageId} componentId={componentId} />
        {!isExploreHidden && <ExploreMenuItem pageId={pageId} componentId={componentId} />}
      </div>
      <div className={styles.communitySideBar__myCommunitiesSection}>
        <MyCommunitiesSideBarTitle pageId={pageId} componentId={componentId} />
        {socialCommunityCreationButtonVisible && (
          <CreateCommunityMenuItem
            pageId={pageId}
            componentId={componentId}
            onPress={() => goToCreateCommunityPage?.({ mode: AmityCommunitySetupPageMode.CREATE })}
          />
        )}
        <MyCommunitiesSideBar pageId={pageId} />
      </div>
    </div>
  );
};

export default CommunitySideBar;
