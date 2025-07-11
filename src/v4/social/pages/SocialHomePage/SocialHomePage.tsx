import React, { useEffect, useRef, useState } from 'react';
import styles from './SocialHomePage.module.css';

import { TopNavigation } from '~/v4/social/components/TopNavigation';
import { MyCommunities } from '~/v4/social/components/MyCommunities';
import { NewsfeedButton } from '~/v4/social/elements/NewsfeedButton';
import { ExploreButton } from '~/v4/social/elements/ExploreButton';
import { MyCommunitiesButton } from '~/v4/social/elements/MyCommunitiesButton';
import { Newsfeed } from '~/v4/social/components/Newsfeed';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CreatePostMenu } from '~/v4/social/components/CreatePostMenu';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { Explore } from '~/v4/social/components/Explore';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { ClipsFeedButton } from '~/v4/social/elements/ClipsFeedButton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import useQueryClipGlobalFeed from '~/v4/social/hooks/useQueryClipGlobalFeed';

export function SocialHomePage({ activeTab: initialActiveTab }: { activeTab?: HomePageTab }) {
  const pageId = 'social_home_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });

  const { scrollPosition, onScroll } = useGlobalFeedContext();

  const { activeTab, setActiveTab } = useLayoutContext();
  const { AmitySocialHomePageBehavior } = usePageBehavior();
  const { posts } = useQueryClipGlobalFeed();

  const [isShowCreatePostMenu, setIsShowCreatePostMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialActiveTab == HomePageTab.Explore) {
      setActiveTab(HomePageTab.Explore);
    }
    if (!containerRef.current) return;
    containerRef.current.scrollTop = scrollPosition;
    setTimeout(() => {
      initialLoad.current = false;
    }, 100);
  }, [containerRef.current, activeTab]);

  const handleClickButton = () => {
    setIsShowCreatePostMenu((prev) => !prev);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (activeTab !== HomePageTab.Newsfeed) return;
    if (initialLoad.current) return;
    onScroll(event);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (isShowCreatePostMenu) {
        setIsShowCreatePostMenu(false);
      }
    };

    if (isShowCreatePostMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isShowCreatePostMenu]);

  return (
    <div className={styles.socialHomePage} style={themeStyles}>
      <div className={styles.socialHomePage__topBar}>
        <div className={styles.socialHomePage__topNavigation}>
          <TopNavigation
            pageId={pageId}
            selectedTab={activeTab}
            onClickPostCreationButton={handleClickButton}
          />
        </div>
        <div className={styles.socialHomePage__tabs}>
          <NewsfeedButton
            pageId={pageId}
            isActive={activeTab === HomePageTab.Newsfeed}
            onClick={() => setActiveTab(HomePageTab.Newsfeed)}
          />
          <ExploreButton
            pageId={pageId}
            isActive={activeTab === HomePageTab.Explore}
            onClick={() => setActiveTab(HomePageTab.Explore)}
          />
          <ClipsFeedButton
            pageId={pageId}
            isActive={activeTab === HomePageTab.Clips}
            onClick={() => {
              setActiveTab(HomePageTab.Clips);
              AmitySocialHomePageBehavior?.goToClipFeedPage?.({});
            }}
          />
          <MyCommunitiesButton
            pageId={pageId}
            isActive={activeTab === HomePageTab.MyCommunities}
            onClick={() => setActiveTab(HomePageTab.MyCommunities)}
          />
        </div>
      </div>
      <NoInternetConnectionHoc page="feed" className={styles.socialHomePage__noConnection}>
        <div className={styles.socialHomePage__contents} ref={containerRef} onScroll={handleScroll}>
          {activeTab === HomePageTab.Newsfeed && <Newsfeed pageId={pageId} />}
          {activeTab === HomePageTab.Explore && <Explore pageId={pageId} />}
          {activeTab === HomePageTab.MyCommunities && <MyCommunities pageId={pageId} />}
        </div>
      </NoInternetConnectionHoc>

      {isShowCreatePostMenu && (
        <div className={styles.socialHomePage__createPostMenu}>
          <CreatePostMenu pageId={pageId} />
        </div>
      )}
    </div>
  );
}
