import React, { useState } from 'react';
import styles from './SocialHomePage.module.css';

import { TopNavigation } from '~/v4/social/components/TopNavigation';
import { MyCommunities } from '~/v4/social/components/MyCommunities';
import { NewsfeedButton } from '~/v4/social/elements/NewsfeedButton';
import { ExploreButton } from '~/v4/social/elements/ExploreButton';
import { MyCommunitiesButton } from '~/v4/social/elements/MyCommunitiesButton';
import { Newsfeed } from '~/v4/social/components/Newsfeed';
import { useAmityPage } from '~/v4/core/hooks/uikit';

enum EnumTabNames {
  Newsfeed = 'Newsfeed',
  Explore = 'Explore',
  MyCommunities = 'My communities',
}

export function SocialHomePage() {
  const pageId = 'social_home_page';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityPage({
      pageId,
    });

  const [activeTab, setActiveTab] = useState(EnumTabNames.Newsfeed);

  return (
    <div className={styles.socialHomePage} style={themeStyles}>
      <div className={styles.socialHomePage__topBar}>
        <TopNavigation pageId={pageId} />
        <div className={styles.socialHomePage__tabs}>
          <NewsfeedButton
            pageId={pageId}
            isActive={activeTab === EnumTabNames.Newsfeed}
            onClick={() => setActiveTab(EnumTabNames.Newsfeed)}
          />
          <ExploreButton pageId={pageId} isActive={activeTab === EnumTabNames.Explore} />
          <MyCommunitiesButton
            pageId={pageId}
            isActive={activeTab === EnumTabNames.MyCommunities}
            onClick={() => setActiveTab(EnumTabNames.MyCommunities)}
          />
        </div>
      </div>
      <div className={styles.socialHomePage__contents}>
        {activeTab === EnumTabNames.Newsfeed && <Newsfeed pageId={pageId} />}
        {activeTab === EnumTabNames.Explore && <div>Explore</div>}
        {activeTab === EnumTabNames.MyCommunities && <MyCommunities pageId={pageId} />}
      </div>
    </div>
  );
}
