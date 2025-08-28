import React, { useEffect, useRef, useState } from 'react';
import styles from './UserProfilePage.module.css';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { UserProfileHeader } from '~/v4/social/components/UserProfileHeader';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { UserFeedTabButton } from '~/v4/social/elements/UserFeedTabButton/UserFeedTabButton';
import { UserImageFeedTabButton } from '~/v4/social/elements/UserImageFeedTabButton/UserImageFeedTabButton';
import { UserVideoFeedTabButton } from '~/v4/social/elements/UserVideoFeedTabButton/UserVideoFeedTabButton';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { UserFeed } from '~/v4/social/components/UserFeed/UserFeed';
import { UserImageFeed } from '~/v4/social/components/UserImageFeed/UserImageFeed';
import { UserVideoFeed } from '~/v4/social/components/UserVideoFeed/UserVideoFeed';
import { FloatingActionButton } from '~/v4/core/components/FloatingActionButton/FloatingActionButton';
import { Plus } from '~/v4/icons/Plus';
import { PercentageCircle } from '~/v4/core/components/PercentageCircle/PercentageCircle';
import ChevronRight from '~/v4/icons/ChevronRight';
import { FloatingActionButtonMenu } from './FloatingActionButtonMenu/FloatingActionButtonMenu';
import useSDK from '~/v4/core/hooks/useSDK';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Button, Typography } from '~/v4/core/components';
import { initChart } from './chartConfig';
import Star from '~/v4/icons/Star';
import { TopNavigation } from '~/v4/social/components/TopNavigation';
import { MasterTrophy } from '~/v4/icons/MasterTrophy';
import { TipsterLogo } from '~/v4/icons/TipsterLogo';

type UserProfilePageProps = {
  userId: string;
  userBadgeTitle?: string;
};

const enum UserProfileTabs {
  FEED = 'feed',
  IMAGE = 'image',
  VIDEO = 'video',
}

const mockSports = [
  { name: 'Calcio', icon: <Star color="#FFA500" />, percentage: 30 },
  { name: 'Tennis', icon: <Star color="#FF6B6B" />, percentage: 25 },
  { name: 'Basket', icon: <Star color="#4ECDC4" />, percentage: 45 },
];

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId, userBadgeTitle }) => {
  const pageId = 'user_profile_page';
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDesktop } = useResponsive();

  const { themeStyles } = useAmityPage({ pageId });
  const { user } = useUser({ userId });
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { currentUserId } = useSDK();

  const isCurrentUser = user?.userId === currentUserId;

  const [isScroll, setIsScroll] = useState(false);
  const [profilingQuizDone, setProfilingQuizDone] = useState(false);
  const [percentage, setPercentage] = useState(10); //mock percentage of quiz completion
  const [currentActiveTab, setCurrentActiveTab] = React.useState<UserProfileTabs>(
    UserProfileTabs.FEED,
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
    if (currentActiveTab === UserProfileTabs.FEED) {
      return <UserFeed pageId={pageId} userId={userId} />;
    } else if (currentActiveTab === UserProfileTabs.IMAGE) {
      return <UserImageFeed pageId={pageId} userId={userId} />;
    } else if (currentActiveTab === UserProfileTabs.VIDEO) {
      return <UserVideoFeed pageId={pageId} userId={userId} />;
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
              Appassionato di sport e giochi di squadra, amo le sfide e condividere emozioni con
              nuovi amici. Sempre pronto a tifare e a mettermi in gioco! Milano, Italia
            </Typography.Caption>

            {!profilingQuizDone && (
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
                  preferenze di gioco, interessi , livello ...
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
