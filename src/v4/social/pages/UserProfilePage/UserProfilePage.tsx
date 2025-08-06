import React, { useEffect, useRef, useState } from 'react';
import styles from './UserProfilePage.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
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
import { FloatingActionButtonMenu } from './FloatingActionButtonMenu/FloatingActionButtonMenu';
import useSDK from '~/v4/core/hooks/useSDK';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { Typography } from '~/v4/core/components';

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
  const [currentActiveTab, setCurrentActiveTab] = React.useState<UserProfileTabs>(
    UserProfileTabs.FEED,
  );

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

  //avtivities to remove from here
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
            <div className={styles.userProfilePage__cardPositioner}>
              <div className={styles.userProfilePage__card}>
                <div>percentuale</div>
                <div>
                  <Typography.Headline>Arricchisci il tuo profilo</Typography.Headline>
                  <Typography.Body>
                    Rendi unico il tuo profilo aggiungi altre info su di te
                  </Typography.Body>
                </div>
                <div>chevronright</div>
              </div>
            </div>
            <div className={styles.userProfilePage__cardPositioner}>
              <div className={styles.userProfilePage__card}>
                <div className={styles.userProfilePage__cardContentSection}>
                  <Typography.Headline>Le tue info</Typography.Headline>
                  <div>ChevronRight</div>
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
