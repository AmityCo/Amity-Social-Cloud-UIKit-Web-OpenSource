import React, { useState, useCallback } from 'react';
import { AppNavBar, AppNavTab } from '~/v4/core/components/AppNavBar';
import { TopBar } from '~/v4/core/components/TopBar';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import useSDK from '~/v4/core/hooks/useSDK';
import styles from './AppContainer.module.css';

interface AppContainerProps {
  socialComponent: React.ReactNode;
  chatComponent: React.ReactNode;
  defaultTab?: AppNavTab;
  chatBadgeCount?: number;
}

export const AppContainer: React.FC<AppContainerProps> = ({
  socialComponent,
  chatComponent,
  defaultTab = 'community',
  chatBadgeCount,
}) => {
  const [activeTab, setActiveTab] = useState<AppNavTab>(defaultTab);
  const { currentUserId } = useSDK();
  const { onClickUser } = useNavigation();

  const handleTabChange = useCallback((tab: AppNavTab) => {
    setActiveTab(tab);
  }, []);

  const handleClickUserProfile = useCallback(() => {
    if (currentUserId) {
      // Switch to community tab so the profile page renders within the social context
      setActiveTab('community');
      onClickUser(currentUserId);
    }
  }, [currentUserId, onClickUser]);

  return (
    <div className={styles.appContainer}>
      <div className={styles.appContainer__navBar}>
        <AppNavBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          chatBadgeCount={chatBadgeCount}
        />
      </div>
      <div className={styles.appContainer__body}>
        <TopBar onClickUserProfile={handleClickUserProfile} />
        <div className={styles.appContainer__content}>
          {activeTab === 'community' && socialComponent}
          {activeTab === 'chat' && chatComponent}
        </div>
      </div>
    </div>
  );
};

export default AppContainer;
