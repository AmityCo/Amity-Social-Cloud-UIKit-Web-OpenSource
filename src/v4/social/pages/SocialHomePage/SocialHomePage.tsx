import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FeedRepository } from '@amityco/ts-sdk';
import { TopNavigation } from '~/v4/social/components/TopNavigation';
import { Newsfeed } from '~/v4/social/components/Newsfeed';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CreatePostMenu } from '~/v4/social/components/CreatePostMenu';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import useSDK from '~/v4/core/hooks/useSDK';
import { Communities } from '~/v4/social/internal-components/Communities/Communities';
import { useForYouFeedCollection } from '~/v4/social/hooks/collections/useForYouFeedCollection';
import { useSocialHomePageTab } from '~/v4/social/features/home/hooks';
import { ForYouFeed } from '~/v4/social/features/for-you';
import styles from './SocialHomePage.module.css';
import { Events } from '~/v4/social/features';
import ChipButton from '~/v4/social/elements/ChipButton';
import { ELEMENT_ID, PAGE_ID } from '~/v4/constants/customization';

export function SocialHomePage({ activeTab: initialActiveTab }: { activeTab?: HomePageTab }) {
  const pageId = 'social_home_page';
  const { isVisitorOrBot } = useSDK();
  const { config } = useCustomization();
  const { themeStyles } = useAmityPage({
    pageId,
  });

  const { scrollPosition, onScroll } = useGlobalFeedContext();

  const { activeTab, setActiveTab } = useLayoutContext();
  const { AmitySocialHomePageBehavior } = usePageBehavior();

  const { error: forYouError } = useForYouFeedCollection({ shouldCall: !isVisitorOrBot });
  const forYouEnabled = !(forYouError instanceof FeedRepository.AmityForYouFeedDisabledError);
  const [persistedTab, setPersistedTab] = useSocialHomePageTab();
  const initialTabResolved = useRef(false);

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

  useEffect(() => {
    if (initialTabResolved.current) return;
    initialTabResolved.current = true;
    if (isVisitorOrBot) {
      setActiveTab(HomePageTab.Communities);
      return;
    }
    if (persistedTab) {
      setActiveTab(persistedTab);
      return;
    }
    setActiveTab(HomePageTab.ForYou);
  }, [isVisitorOrBot, persistedTab, setActiveTab]);

  useEffect(() => {
    if (forYouEnabled) return;
    if (activeTab === HomePageTab.ForYou) {
      setActiveTab(HomePageTab.Newsfeed);
    }
  }, [forYouEnabled, activeTab, setActiveTab]);

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
        return;
      }
      setPersistedTab(tab);
    },
    [setActiveTab, AmitySocialHomePageBehavior, setPersistedTab],
  );

  const renderChipButtons = () => {
    const viewableUserType = config?.feature_flags?.post?.clip?.can_view_tab;
    const hideClipFeedTab = isVisitorOrBot && viewableUserType !== 'all';

    return (
      <div className={styles.socialHomePage__tabs}>
        {!isVisitorOrBot && forYouEnabled && (
          <ChipButton
            pageId={PAGE_ID.SOCIAL_HOME_PAGE}
            elementId={ELEMENT_ID.FOR_YOU_BUTTON}
            isActive={activeTab === HomePageTab.ForYou}
            onPress={() => handleTabClick(HomePageTab.ForYou)}
            textId="amity_social_button_social_home_for_you_button"
          />
        )}
        {!isVisitorOrBot && (
          <ChipButton
            pageId={PAGE_ID.SOCIAL_HOME_PAGE}
            elementId={ELEMENT_ID.NEWSFEED_BUTTON}
            isActive={activeTab === HomePageTab.Newsfeed}
            onPress={() => handleTabClick(HomePageTab.Newsfeed)}
            textId="amity_social_button_social_home_newsfeed_button"
          />
        )}
        <ChipButton
          pageId={PAGE_ID.SOCIAL_HOME_PAGE}
          elementId={ELEMENT_ID.COMMUNITIES_BUTTON}
          isActive={activeTab === HomePageTab.Communities}
          onPress={() => handleTabClick(HomePageTab.Communities)}
          textId="amity_social_button_social_home_communities_button"
        />
        <ChipButton
          pageId={PAGE_ID.SOCIAL_HOME_PAGE}
          elementId={ELEMENT_ID.EVENTS_BUTTON}
          isActive={activeTab === HomePageTab.Events}
          onPress={() => handleTabClick(HomePageTab.Events)}
          textId="amity_social_button_social_home_events_button"
        />
        {!hideClipFeedTab && (
          <ChipButton
            pageId={PAGE_ID.SOCIAL_HOME_PAGE}
            elementId={ELEMENT_ID.CLIPSFEED_BUTTON}
            isActive={activeTab === HomePageTab.Clips}
            onPress={() => handleTabClick(HomePageTab.Clips)}
            textId="amity_social_button_social_home_clips_button"
          />
        )}
      </div>
    );
  };

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
        {renderChipButtons()}
      </div>
      <NoInternetConnectionHoc page="feed" className={styles.socialHomePage__noConnection}>
        <div className={styles.socialHomePage__contents} ref={containerRef} onScroll={handleScroll}>
          {activeTab === HomePageTab.ForYou && <ForYouFeed pageId={pageId} />}
          {activeTab === HomePageTab.Newsfeed && <Newsfeed pageId={pageId} />}
          {activeTab === HomePageTab.Communities && <Communities pageId={pageId} />}
          {activeTab === HomePageTab.Events && <Events pageId={pageId} />}
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
