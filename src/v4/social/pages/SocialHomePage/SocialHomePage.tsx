import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FeedRepository } from '@amityco/ts-sdk';
import { TopNavigation } from '~/v4/social/components/TopNavigation';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CreatePostMenu } from '~/v4/social/components/CreatePostMenu';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { NoInternetConnectionHoc } from '~/v4/social/internal-components/NoInternetConnection/NoInternetConnectionHoc';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import useSDK from '~/v4/core/hooks/useSDK';
import { useForYouFeedCollection } from '~/v4/social/hooks/collections/useForYouFeedCollection';
import useForYouFeedSetting from '~/v4/social/hooks/useForYouFeedSetting';
import { useSocialHomePageTab } from '~/v4/social/features/home/hooks';
import { Newsfeed } from '~/v4/social/components/Newsfeed';
import { ForYouFeed } from '~/v4/social/features/for-you';
import { Communities } from '~/v4/social/internal-components/Communities/Communities';
import { Events } from '~/v4/social/features';
import { Skeleton } from '~/v4/core/components/Skeleton/Skeleton';
import { PostContentSkeleton } from '~/v4/social/components/PostContent';
import { GlobalFeedStorySkeleton } from '~/v4/social/internal-components/Skeleton/GlobalFeedStorySkeleton/GlobalFeedStorySkeleton';
import { Divider } from '~/v4/social/elements/Divider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import styles from './SocialHomePage.module.css';
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

  const { forYouFeedSetting, isPending: isForYouFeedSettingPending } = useForYouFeedSetting({
    shouldCall: !isVisitorOrBot,
  });

  const forYouEnabled = !isVisitorOrBot && forYouFeedSetting?.forYouFeed.enabled;

  const { error: forYouError } = useForYouFeedCollection({
    shouldCall: !!forYouEnabled,
  });

  const isForYouTabVisible =
    forYouEnabled && !(forYouError instanceof FeedRepository.AmityForYouFeedDisabledError);

  const [persistedTab, setPersistedTab] = useSocialHomePageTab();

  const initialTabResolved = useRef(false);

  const [isInitialTabResolved, setIsInitialTabResolved] = useState(false);

  const isResolvingForYou =
    !isVisitorOrBot && (isForYouFeedSettingPending || !isInitialTabResolved);

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
    if (isVisitorOrBot) {
      initialTabResolved.current = true;
      setActiveTab(HomePageTab.Communities);
      setIsInitialTabResolved(true);
      return;
    }
    if (isForYouFeedSettingPending) return;
    initialTabResolved.current = true;
    if (persistedTab && (persistedTab !== HomePageTab.ForYou || isForYouTabVisible)) {
      setActiveTab(persistedTab);
    } else {
      setActiveTab(isForYouTabVisible ? HomePageTab.ForYou : HomePageTab.Newsfeed);
    }
    setIsInitialTabResolved(true);
  }, [isVisitorOrBot, isForYouFeedSettingPending, isForYouTabVisible, persistedTab, setActiveTab]);

  useEffect(() => {
    if (isForYouTabVisible) return;
    if (activeTab === HomePageTab.ForYou) {
      setActiveTab(HomePageTab.Newsfeed);
    }
  }, [isForYouTabVisible, activeTab, setActiveTab]);

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
        {isForYouTabVisible && (
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
        {isResolvingForYou ? <SocialHomePage.TabsSkeleton /> : renderChipButtons()}
      </div>
      <NoInternetConnectionHoc page="feed" className={styles.socialHomePage__noConnection}>
        <div className={styles.socialHomePage__contents} ref={containerRef} onScroll={handleScroll}>
          {isResolvingForYou ? (
            <SocialHomePage.FeedSkeleton pageId={pageId} />
          ) : (
            <>
              {activeTab === HomePageTab.ForYou && <ForYouFeed pageId={pageId} />}
              {activeTab === HomePageTab.Newsfeed && <Newsfeed pageId={pageId} />}
              {activeTab === HomePageTab.Communities && <Communities pageId={pageId} />}
              {activeTab === HomePageTab.Events && <Events pageId={pageId} />}
            </>
          )}
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

function TabsSkeleton() {
  return (
    <Skeleton className={styles.socialHomePage__tabs} data-testid="social_home_tabs_skeleton">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton.Square
          key={`tab-pill-${index}`}
          className={styles.socialHomePage__tabSkeletonPill}
          width="5rem"
          height="2.375rem"
          radius="10rem"
        />
      ))}
    </Skeleton>
  );
}

function FeedSkeleton({ pageId }: { pageId?: string }) {
  const { isDesktop } = useResponsive();

  return (
    <Skeleton
      className={styles.socialHomePage__feedSkeleton}
      data-testid="social_home_feed_skeleton"
    >
      <Skeleton className={styles.socialHomePage__feedSkeletonStories}>
        {Array.from({ length: 7 }).map((_, index) => (
          <GlobalFeedStorySkeleton key={`story-${index}`} />
        ))}
      </Skeleton>
      <Skeleton className={styles.socialHomePage__feedSkeletonComposer}>
        <Skeleton.Circle width="2.5rem" height="2.5rem" />
        <Skeleton.Square
          className={styles.socialHomePage__feedSkeletonComposerInput}
          width="100%"
          height="2.5rem"
          radius="1.25rem"
        />
      </Skeleton>
      <Divider isShown={!isDesktop} />
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={`post-${index}`}>
          <PostContentSkeleton pageId={pageId} />
          <Divider isShown={!isDesktop && index !== 3} />
        </Skeleton>
      ))}
    </Skeleton>
  );
}

SocialHomePage.TabsSkeleton = TabsSkeleton;

SocialHomePage.FeedSkeleton = FeedSkeleton;
