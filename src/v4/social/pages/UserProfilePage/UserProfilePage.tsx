import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Typography } from '~/v4/core/components';
import { FloatingActionButton } from '~/v4/core/components/FloatingActionButton/FloatingActionButton';
import { PercentageCircle } from '~/v4/core/components/PercentageCircle/PercentageCircle';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { UserMenu } from '~/v4/social/internal-components/UserMenu';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import useSDK from '~/v4/core/hooks/useSDK';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import ChevronRight from '~/v4/icons/ChevronRight';
import { MasterTrophy } from '~/v4/icons/MasterTrophy';
import { Plus } from '~/v4/icons/Plus';
import Star from '~/v4/icons/Star';
import { TipsterLogo } from '~/v4/icons/TipsterLogo';
import { TopNavigation } from '~/v4/social/components/TopNavigation';
import { UserFeed } from '~/v4/social/components/UserFeed/UserFeed';
import { UserImageFeed } from '~/v4/social/components/UserImageFeed/UserImageFeed';
import { UserProfileHeader } from '~/v4/social/components/UserProfileHeader';
import { UserVideoFeed } from '~/v4/social/components/UserVideoFeed/UserVideoFeed';
import { UserFeedTabButton } from '~/v4/social/elements/UserFeedTabButton/UserFeedTabButton';
import { UserImageFeedTabButton } from '~/v4/social/elements/UserImageFeedTabButton/UserImageFeedTabButton';
import { UserVideoFeedTabButton } from '~/v4/social/elements/UserVideoFeedTabButton/UserVideoFeedTabButton';
import { initChart } from './chartConfig';
import { FloatingActionButtonMenu } from './FloatingActionButtonMenu/FloatingActionButtonMenu';
import styles from './UserProfilePage.module.css';
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

type UserProfilePageProps = {
  userId: string;
  userBadgeTitle?: string;
  forcePublicView?: boolean;
};

export const enum UserProfileTabs {
  FEED = 'feed',
  IMAGE = 'image',
  VIDEO = 'video',
}

const mockSports = [
  { name: 'Calcio', icon: <Star color="#FFA500" />, percentage: 30 },
  { name: 'Tennis', icon: <Star color="#FF6B6B" />, percentage: 25 },
  { name: 'Basket', icon: <Star color="#4ECDC4" />, percentage: 45 },
];

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  userId,
  userBadgeTitle,
  forcePublicView,
}) => {
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

  const pageId = 'user_profile_page';
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDesktop } = useResponsive();
  const initialLoad = useRef(true);
  const { followStatus } = useFollowCount(userId);

  const { onScroll, scrollPosition } = useFeedScrollContext();
  const { themeStyles } = useAmityPage({ pageId });
  const { user } = useUser({ userId });
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { currentUserId } = useSDK();
  const { confirm } = useConfirmContext();
  const { openPopup } = usePopupContext();
  const { linkToPost } = useLayoutContext();
  const { socialSettings } = useSocialSettings();

  const isCurrentUser = forcePublicView ? false : user?.userId === currentUserId;

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
  const [profilingQuizDone, setProfilingQuizDone] = useState(false);
  const [percentage, setPercentage] = useState(10); //mock percentage of quiz completion
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
    linkToPost?.tab === UserProfileTabs.FEED ||
      linkToPost?.tab === UserProfileTabs.IMAGE ||
      linkToPost?.tab === UserProfileTabs.VIDEO
      ? linkToPost?.tab
      : UserProfileTabs.FEED,
  );

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const timer = setTimeout(() => {
      cleanup = initChart();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  const onChangeTab = (tab: UserProfileTabs) => {
    setCurrentActiveTab(tab);
  };

  const renderTabContent = () => {
    console.log('tab', currentActiveTab);
    if (currentActiveTab === UserProfileTabs.FEED) {
      return <UserFeed pageId={pageId} userId={userId} />;
    } else if (currentActiveTab === UserProfileTabs.IMAGE) {
      return (
        <UserImageFeed
          pageId={pageId}
          userId={userId}
          feedSources={feedSources}
          followStatus={followStatus}
        />
      );
    } else if (currentActiveTab === UserProfileTabs.VIDEO) {
      return (
        <UserVideoFeed
          pageId={pageId}
          userId={userId}
          feedSources={feedSources}
          followStatus={followStatus}
        />
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop;

        if (scrollPosition > 0) {
          setIsScroll(true);
        } else {
          setIsScroll(false);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  useEffect(() => {
    setProfilingQuizDone(false);
  }, []);

  //activities to remove from here
  const renderActivityTabs = () => {
    return (
      <div className={styles.userProfilePage__feedTabs}>
        <UserFeedTabButton
          pageId={pageId}
          isActive={currentActiveTab === UserProfileTabs.FEED}
          onClick={() => onChangeTab(UserProfileTabs.FEED)}
        />
        <UserImageFeedTabButton
          pageId={pageId}
          isActive={currentActiveTab === UserProfileTabs.IMAGE}
          onClick={() => onChangeTab(UserProfileTabs.IMAGE)}
        />
        <UserVideoFeedTabButton
          pageId={pageId}
          isActive={currentActiveTab === UserProfileTabs.VIDEO}
          onClick={() => onChangeTab(UserProfileTabs.VIDEO)}
        />
      </div>
    );
  };
  const onCloseCreatePostPopup = ({ close }: { close: () => void }) => {
    confirm({
      onOk: close,
      type: 'confirm',
      okText: 'Discard',
      cancelText: 'Keep editing',
      title: 'Discard this post?',
      pageId: 'post_composer_page',
      content: 'The post will be permanently discarded. It cannot be undone.',
    });
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

  return (
    <>
      <PullToRefresh className={styles.userProfilePage} style={themeStyles}>
        <TopNavigation pageId={pageId} />

        <div className={styles.userProfilePage__container} ref={containerRef}>
          <div className={styles.userProfilePage__cardBorders}>
            <UserProfileHeader
              user={user}
              pageId={pageId}
              userBadgeTitle={userBadgeTitle}
              isCurrentUser={isCurrentUser}
            />
            <Typography.Caption className={styles.userProfilePage__caption}>
              {user?.description || ''}
            </Typography.Caption>

            {!profilingQuizDone && isCurrentUser && (
              <div className={styles.userProfilePage__cardPositioner}>
                <div className={styles.userProfilePage__card}>
                  <div className={styles.userProfilePage__cardContentSection}>
                    <PercentageCircle percentage={percentage} />

                    <div className="flex grow gap-2 justify-between">
                      <div className="flex flex-col gap-2 content-center">
                        <Typography.BodyBold>Arricchisci il tuo profilo</Typography.BodyBold>
                        <Typography.Body>
                          Rendi unico il tuo profilo aggiungi altre info su di te
                        </Typography.Body>
                      </div>
                      <div>
                        <ChevronRight width={24} height={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.userProfilePage__cardPositioner}>
              <div className={styles.userProfilePage__card}>
                <div className={styles.userProfilePage__cardContentSection}>
                  <Typography.BodyBold>Le tue info</Typography.BodyBold>
                  <ChevronRight />
                </div>
                <div className={styles.userProfilePage__cardContentSection}>
                  preferenze di gioco, interessi, livello ...
                </div>
              </div>
              <div className={styles.userProfilePage__card}>
                <div className={styles.userProfilePage__cardContentSection}>
                  <Typography.BodyBold>Il Tuo status Cliente</Typography.BodyBold>
                  <Typography.Link>Vedi</Typography.Link>
                </div>
                <div className={styles.userProfilePage__cardContentSection}>
                  <MasterTrophy />
                  <div className={styles.userProfilePage__clientStatus}>
                    <Typography.TitleBold style={{ color: '#DB9628' }}>Master</Typography.TitleBold>{' '}
                    <Typography.CaptionSmall style={{ color: '#909090' }}>
                      Visibile solo a te
                    </Typography.CaptionSmall>
                  </div>
                </div>
              </div>
            </div>
            {/* second big card tipster */}
            {/* Icon and link */}
            <div className={styles.userProfilePage__card} id="tipsterParentCard">
              <div className={styles.userProfilePage__cardContentSection}>
                <TipsterLogo />
                <Typography.Link>Vedi</Typography.Link>
              </div>
              {/* Chip container => relace with buttons */}
              <div className={styles.userProfilePage__flexContainer}>
                <div className={styles.userProfilePage__chip}>
                  <Typography.CaptionBold>Scommesse</Typography.CaptionBold>
                </div>
                <div className={styles.userProfilePage__chip}>
                  <Typography.CaptionBold>Casino</Typography.CaptionBold>
                </div>
                <div className={styles.userProfilePage__chip}>
                  <Typography.CaptionBold>Poker</Typography.CaptionBold>
                </div>
                <div className={styles.userProfilePage__chip}>
                  <Typography.CaptionBold>Bingo</Typography.CaptionBold>
                </div>
              </div>
              {/* chart block */}
              <div className={styles.userProfilePage__tipsterSection}>
                <div className={styles.userProfilePage__tipsterCard} id="tipsterCard">
                  <div className={styles.userProfilePage__cardBorders} style={{ width: '100%' }}>
                    <div className={styles.userProfilePage__chartCardBorders}>
                      <Typography.BodyBold>Social Index</Typography.BodyBold>
                      <Typography.Link>Cos'è</Typography.Link>
                    </div>
                    <div id="tipsterChart" className={styles.userProfilePage__chartWrapper}></div>
                  </div>
                </div>
                <div className={styles.userProfilePage__mainSportsCard}>
                  <Typography.BodyBold>Giochi principalmente a</Typography.BodyBold>
                  <div className={styles.userProfilePage__flexContainer}>
                    {mockSports.map((sport, index) => (
                      <div key={index} className={styles.userProfilePage__gameStatCard}>
                        <div>{sport.icon}</div>
                        <Typography.TicketSizeTitle>{sport.name}</Typography.TicketSizeTitle>
                        <Typography.TicketSizeText>({sport.percentage}%)</Typography.TicketSizeText>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
          {renderActivityTabs()}
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
