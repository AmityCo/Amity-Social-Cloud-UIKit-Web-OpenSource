import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './UserProfilePage.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { UserMenu } from '~/v4/social/internal-components/UserMenu';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { UserProfileHeader } from '~/v4/social/components/UserProfileHeader';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { UserFeedTabButton } from '~/v4/social/elements/UserFeedTabButton/UserFeedTabButton';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { UserFeed } from '~/v4/social/components/UserFeed/UserFeed';
import { Typography } from '~/v4/core/components';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { FloatingActionButton } from '~/v4/core/components/FloatingActionButton/FloatingActionButton';
import { Plus } from '~/v4/icons/Plus';
import { FloatingActionButtonMenu } from './FloatingActionButtonMenu/FloatingActionButtonMenu';
import { Popover } from '~/v4/core/components/AriaPopover';
import useSDK from '~/v4/core/hooks/useSDK';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { PollTypeSelection } from '~/v4/social/components/PollTypeSelection';
import { Mode, PostComposerPage } from '~/v4/social/pages/PostComposerPage';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useFeedScrollContext } from '~/v4/core/providers/FeedScrollProvider';
import { Button } from '~/v4/core/natives/Button';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';
import { ChevronTop } from '~/v4/icons/ChevronTop';
import { ChevronDown } from '~/v4/icons/ChevronDown';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { FeedSourceEnum } from '@amityco/ts-sdk';
import useSocialSettings from '~/v4/social/hooks/useSocialSettings';
import { UserMediaFeedTabButton } from '~/v4/social/elements/UserMediaFeedTabButton';
import { UserMediaFeed } from '~/v4/social/features';
import { useDiscardPostCreation } from '~/v4/social/hooks';

type UserProfilePageProps = {
  userId: string;
};

export const enum UserProfileTabs {
  FEED = 'feed',
  MEDIA = 'media',
}

export const FeedSource = {
  ALL: 'all',
  COMMUNITY: FeedSourceEnum.Community,
  USER: FeedSourceEnum.User,
};

const FEED_TYPE_OPTIONS = [
  {
    label: 'Public community & profile posts',
    value: FeedSource.ALL,
  },
  {
    label: 'Public community posts',
    value: FeedSource.COMMUNITY,
  },
  {
    label: 'Profile posts',
    value: FeedSource.USER,
  },
];

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId }) => {
  const pageId = 'user_profile_page';
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDesktop } = useResponsive();
  const initialLoad = useRef(true);
  const { followStatus } = useFollowCount(userId);

  const { onScroll, scrollPosition } = useFeedScrollContext();
  const { themeStyles } = useAmityPage({ pageId });
  const { user } = useUser({ userId });
  const { onBack, goToCreateLivestreamPage } = useNavigation();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { currentUserId } = useSDK();
  const { discardPostCreation } = useDiscardPostCreation();
  const { openPopup } = usePopupContext();
  const { linkToPost } = useLayoutContext();
  const { socialSettings } = useSocialSettings();

  const isCurrentUser = user?.userId === currentUserId;

  useEffect(() => {
    if (!containerRef.current) return;

    if (scrollPosition > 0) {
      // Use scrollTo for more reliable scroll positioning
      containerRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'auto',
      });
    }

    const timer = setTimeout(() => {
      initialLoad.current = false;
    }, 100);
    return () => clearTimeout(timer);
  }, [containerRef.current]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (!initialLoad.current) {
      onScroll(event);
    }

    // Handle isScroll state for sticky header
    if (containerRef.current) {
      const scrollPosition = containerRef.current.scrollTop;
      if (scrollPosition > 0) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    }
  };

  const [isScroll, setIsScroll] = useState(false);
  const [feedSource, setFeedSource] = useState(
    linkToPost && linkToPost?.feedSources?.length === 1 ? linkToPost?.feedSources[0] : 'all',
  );

  const feedSources: FeedSourceEnum[] = useMemo(
    () =>
      feedSource === FeedSource.ALL
        ? [FeedSourceEnum.User, FeedSourceEnum.Community]
        : [feedSource as FeedSourceEnum],
    [feedSource],
  );

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [feedSource]);

  const [currentActiveTab, setCurrentActiveTab] = React.useState<UserProfileTabs>(
    linkToPost?.tab === UserProfileTabs.FEED || linkToPost?.tab === UserProfileTabs.MEDIA
      ? linkToPost?.tab
      : UserProfileTabs.FEED,
  );

  const onChangeTab = (tab: UserProfileTabs) => {
    setCurrentActiveTab(tab);
  };

  const renderTabContent = () => {
    if (currentActiveTab === UserProfileTabs.FEED) {
      return (
        <>
          {isCurrentUser && (
            <PostComposer
              pageId={pageId}
              onClickPost={() => {
                openPopup({
                  pageId,
                  view: 'desktop',
                  isDismissable: false,
                  onClose: ({ close }) => discardPostCreation({ pageId, onDiscard: close }),
                  header: CreatePostHeader,
                  children: (
                    <PostComposerPage mode={Mode.CREATE} targetType="user" targetId={null} />
                  ),
                });
              }}
              onClickPoll={() => {
                openPopup({
                  pageId,
                  view: 'desktop',
                  isDismissable: false,
                  header: <Typography.Headline>Choose poll type</Typography.Headline>,
                  children: ({ close }) => (
                    <PollTypeSelection onClickNext={close} targetId={null} targetType="user" />
                  ),
                });
              }}
              onClickLivestream={() =>
                goToCreateLivestreamPage?.({
                  targetId: userId,
                  targetType: 'user',
                })
              }
            />
          )}
          <UserFeed
            pageId={pageId}
            userId={userId}
            feedSources={feedSources}
            followStatus={followStatus}
          />
        </>
      );
    } else if (currentActiveTab === UserProfileTabs.MEDIA) {
      return (
        <UserMediaFeed
          pageId={pageId}
          userId={userId}
          feedSources={feedSources}
          followStatus={followStatus}
        />
      );
    }
  };

  const CreatePostHeader = (
    <Typography.Headline className={styles.userProfilePage__createPostHeader}>
      My Timeline
    </Typography.Headline>
  );

  const isFilterAvailable =
    isCurrentUser ||
    (socialSettings?.userPrivacySetting === 'public' && followStatus !== 'blocked') ||
    followStatus === 'accepted';

  const isFilterAvailable =
    isCurrentUser || socialSettings?.userPrivacySetting === 'public' || followStatus === 'accepted';

  return (
    <>
      <PullToRefresh className={styles.userProfilePage} style={themeStyles}>
        <div
          className={styles.userProfilePage__container}
          ref={containerRef}
          onScroll={handleScroll}
        >
          <div className={styles.userProfilePage__topBar}>
            <BackButton pageId={pageId} onPress={() => onBack()} />
            <Typography.TitleBold
              className={styles.userProfilePage__displayName}
              data-show={isScroll}
            >
              {user?.displayName}
            </Typography.TitleBold>
            <Popover
              trigger={{
                pageId,
                onClick: ({ closePopover }) =>
                  setDrawerData({
                    content: (
                      <UserMenu
                        pageId={pageId}
                        user={user}
                        onCloseMenu={() => {
                          closePopover();
                          removeDrawerData();
                        }}
                      />
                    ),
                  }),
              }}
            >
              {({ closePopover }) => (
                <UserMenu
                  pageId={pageId}
                  user={user}
                  onCloseMenu={() => {
                    closePopover();
                    removeDrawerData();
                  }}
                />
              )}
            </Popover>
          </div>
          <div className={styles.userProfilePage__topSection}>
            <UserProfileHeader user={user} pageId={pageId} />
          </div>
          <div className={styles.userProfilePage__stickyHeader}>
            <div className={styles.userProfilePage__feedTabs}>
              <UserFeedTabButton
                pageId={pageId}
                isActive={currentActiveTab === UserProfileTabs.FEED}
                onClick={() => onChangeTab(UserProfileTabs.FEED)}
              />
              <UserMediaFeedTabButton
                onPress={() => onChangeTab(UserProfileTabs.MEDIA)}
                isActive={currentActiveTab === UserProfileTabs.MEDIA}
              />
            </div>
            {isFilterAvailable && (
              <Popover
                placement="bottom left"
                containerClassName={styles.userProfilePage__feedTypePopover}
                trigger={({ openPopover, isOpen, isDesktop }) => (
                  <Button
                    onPress={() => {
                      if (isDesktop) {
                        openPopover();
                      } else {
                        setDrawerData({
                          content: (
                            <RadioGroup
                              value={feedSource}
                              onChange={(value) => {
                                setFeedSource(value as FeedSourceEnum);
                                removeDrawerData();
                              }}
                              className={styles.userProfilePage__feedTypeRadioGroup}
                              radioProps={{ className: styles.userProfilePage__feedTypeRadio }}
                              radios={FEED_TYPE_OPTIONS.map((option) => ({
                                ...option,
                                label: <Typography.BodyBold>{option.label}</Typography.BodyBold>,
                              }))}
                            />
                          ),
                        });
                      }
                    }}
                    className={styles.userProfilePage__feedTypeButton}
                  >
                    <Typography.CaptionBold>
                      {FEED_TYPE_OPTIONS.find((option) => option.value === feedSource)?.label}
                    </Typography.CaptionBold>
                    {isOpen ? (
                      <ChevronTop className={styles.userProfilePage__feedTypeButtonIcon} />
                    ) : (
                      <ChevronDown className={styles.userProfilePage__feedTypeButtonIcon} />
                    )}
                  </Button>
                )}
              >
                {({ closePopover }) => (
                  <RadioGroup
                    value={feedSource}
                    onChange={(value) => {
                      setFeedSource(value as FeedSourceEnum);
                      closePopover();
                    }}
                    className={styles.userProfilePage__feedTypeRadioGroup}
                    radioProps={{ className: styles.userProfilePage__feedTypeRadio }}
                    radios={FEED_TYPE_OPTIONS.map((option) => ({
                      ...option,
                      label: <Typography.BodyBold>{option.label}</Typography.BodyBold>,
                    }))}
                  />
                )}
              </Popover>
            )}
          </div>
          {renderTabContent()}
        </div>
      </PullToRefresh>
      {!isDesktop && isCurrentUser && (
        <FloatingActionButton
          icon={Plus}
          className={styles.userProfilePage__floatingButton}
          onPress={() =>
            setDrawerData({
              content: (
                <FloatingActionButtonMenu userId={userId} onPressMenu={() => removeDrawerData()} />
              ),
            })
          }
        />
      )}
    </>
  );
};
