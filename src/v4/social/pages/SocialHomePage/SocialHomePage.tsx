import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';

import useSDK from '~/v4/core/hooks/useSDK';

export function SocialHomePage({ activeTab: initialActiveTab }: { activeTab?: HomePageTab }) {
  const pageId = 'social_home_page';
  const { currentUser, isVisitorOrBot } = useSDK();
  const { config } = useCustomization();
  const { themeStyles } = useAmityPage({
    pageId,
  });

  const { scrollPosition, onScroll } = useGlobalFeedContext();

  const { activeTab, setActiveTab } = useLayoutContext();
  const { AmitySocialHomePageBehavior } = usePageBehavior();

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

  const handleTabClick = useCallback(
    (tab: HomePageTab) => {
      setActiveTab(tab);
      if (tab === HomePageTab.Clips) {
        AmitySocialHomePageBehavior?.goToClipFeedPage?.({});
      }
    },
    [setActiveTab, AmitySocialHomePageBehavior],
  );

  const renderTabButtons = useCallback(() => {
    const viewableUserType = config?.feature_flags?.post?.clip?.can_view_tab;
    const hideClipFeedTab = isVisitorOrBot && viewableUserType !== 'all';

    return (
      <>
        {!isVisitorOrBot && (
          <NewsfeedButton
            pageId={pageId}
            isActive={activeTab === HomePageTab.Newsfeed}
            onClick={() => handleTabClick(HomePageTab.Newsfeed)}
          />
        )}
        <ExploreButton
          pageId={pageId}
          isActive={activeTab === HomePageTab.Explore}
          onClick={() => handleTabClick(HomePageTab.Explore)}
        />
        {!hideClipFeedTab && (
          <ClipsFeedButton
            pageId={pageId}
            isActive={activeTab === HomePageTab.Clips}
            onClick={() => handleTabClick(HomePageTab.Clips)}
          />
        )}
        {!isVisitorOrBot && (
          <MyCommunitiesButton
            pageId={pageId}
            isActive={activeTab === HomePageTab.MyCommunities}
            onClick={() => handleTabClick(HomePageTab.MyCommunities)}
          />
        )}
      </>
    );
  }, [config?.feature_flags?.post?.clip?.can_view_tab, isVisitorOrBot]);

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
        <div className={styles.socialHomePage__tabs}>{renderTabButtons()}</div>
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
