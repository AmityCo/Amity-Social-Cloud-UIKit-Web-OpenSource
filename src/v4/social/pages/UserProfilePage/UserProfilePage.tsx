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
import { Input } from 'react-aria-components';
import * as echarts from 'echarts';
type UserProfilePageProps = {
  userId: string;
  userBadgeTitle?: string;
};

const enum UserProfileTabs {
  FEED = 'feed',
  IMAGE = 'image',
  VIDEO = 'video',
}

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
    const initChart = () => {
      const chartElement = document.getElementById('tipsterChart');
      if (chartElement && chartElement.clientWidth > 0 && chartElement.clientHeight > 0) {
        const myChart = echarts.init(chartElement);
        const radarOptions = {
          color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
          title: {
            text: 'Customized Radar Chart',
          },
          legend: {},
          radar: [
            {
              indicator: [
                { text: 'Indicator1' },
                { text: 'Indicator2' },
                { text: 'Indicator3' },
                { text: 'Indicator4' },
                { text: 'Indicator5' },
              ],
              center: ['25%', '50%'],
              radius: 120,
              startAngle: 90,
              splitNumber: 4,
              shape: 'circle',
              axisName: {
                formatter: (value: string) => {
                  return ['{icon|🎯}', '{label|' + value + '}', '{number|}', '{media|}'].join('\n');
                },
                rich: {
                  icon: {
                    fontSize: 16,
                    lineHeight: 20,
                    align: 'center',
                  },
                  label: {
                    color: '#6B6B6B',
                    align: 'center',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: 14,
                  },
                  number: {
                    color: '#00653B',
                    align: 'center',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: 16,
                    fontWeight: 900,
                    lineHeight: 16,
                  },
                  media: {
                    color: '#00653B',
                    align: 'center',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: 14,
                  },
                },
              },
              splitArea: {
                areaStyle: {
                  color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
                  shadowColor: 'rgba(0, 0, 0, 0.2)',
                  shadowBlur: 10,
                },
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(211, 253, 250, 0.8)',
                },
              },
              splitLine: {
                lineStyle: {
                  color: 'rgba(211, 253, 250, 0.8)',
                },
              },
            },
            {
              indicator: [
                { text: 'Indicator1', max: 150 },
                { text: 'Indicator2', max: 150 },
                { text: 'Indicator3', max: 150 },
                { text: 'Indicator4', max: 120 },
                { text: 'Indicator5', max: 108 },
                { text: 'Indicator6', max: 72 },
              ],
              center: ['75%', '50%'],
              radius: 120,
              axisName: {
                color: '#fff',
                backgroundColor: '#666',
                borderRadius: 3,
                padding: [3, 5],
              },
            },
          ],
          series: [
            {
              type: 'radar',
              emphasis: {
                lineStyle: {
                  width: 4,
                },
              },
              data: [
                {
                  value: [100, 8, 0.4, -80, 2000],
                  name: 'Data A',
                },
                {
                  value: [60, 5, 0.3, -100, 1500],
                  name: 'Data B',
                  areaStyle: {
                    color: 'rgba(255, 228, 52, 0.6)',
                  },
                },
              ],
            },
          ],
        };
        myChart.setOption(radarOptions);

        // Cleanup function
        return () => {
          myChart.dispose();
        };
      }
      return null;
    };

    const timer = setTimeout(initChart, 100);

    return () => {
      clearTimeout(timer);
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
        <Typography.Headline>Il tuo profilo community</Typography.Headline>
        <div className={styles.userProfilePage__container} ref={containerRef}>
          <Button onClick={() => setProfilingQuizDone(!profilingQuizDone)}>Quiz !Completed</Button>
          //Mock input just for seeing the value changing
          <Input
            onChange={(e) => {
              setPercentage(+e.target.value);
            }}
          />
          <div className={styles.userProfilePage__topSection}>
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
                    <div className={styles.userProfilePage__cardContentSection__grow}>
                      <Typography.Headline>Arricchisci il tuo profilo</Typography.Headline>
                      <Typography.Body>
                        Rendi unico il tuo profilo aggiungi altre info su di te
                      </Typography.Body>
                    </div>
                    <ChevronRight />
                  </div>
                </div>
              </div>
            )}

            <div className={styles.userProfilePage__cardPositioner}>
              <div className={styles.userProfilePage__card}>
                <div className={styles.userProfilePage__cardContentSection}>
                  <Typography.Headline>Le tue info</Typography.Headline>
                  <ChevronRight />
                </div>
                <div className={styles.userProfilePage__cardContentSection}>
                  preferenze di gioco, interessi , livello ...
                </div>
              </div>
              <div className={styles.userProfilePage__card}>
                <div className={styles.userProfilePage__cardContentSection}>
                  <Typography.Headline>Il Tuo status Cliente</Typography.Headline>
                  <div>Vedi</div>
                </div>
                <div className={styles.userProfilePage__cardContentSection}>
                  <div>Icona</div>
                  <div>Master</div>
                  <div>Visibile solo a te</div>
                </div>
              </div>
            </div>
          </div>
          {/* second big card tipster */}
          <div className={styles.userProfilePage__card}>
            <div className={styles.userProfilePage__cardContentSection}>
              <div>Tipster</div>
              <div>vedi</div>
            </div>
            <div className={styles.userProfilePage__chipContainer}>
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
            <div>
              <h1>CHART IS GONNA GO HERE</h1>
              <div id="tipsterChart" className={styles.userProfilePage__chartWrapper}></div>
            </div>
          </div>
        </div>
      </PullToRefresh>
      {renderActivityTabs()}
      {renderTabContent()}
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
