import React from 'react';
import clsx from 'clsx';
import { CommunityNavIcon, ChatNavIcon } from './NavIcons';
import styles from './AppNavBar.module.css';

export type AppNavTab = 'community' | 'chat';

interface AppNavBarProps {
  activeTab: AppNavTab;
  onTabChange: (tab: AppNavTab) => void;
  chatBadgeCount?: number;
}

export const AppNavBar: React.FC<AppNavBarProps> = ({ activeTab, onTabChange, chatBadgeCount }) => {
  return (
    <nav className={styles.appNavBar}>
      <button
        className={clsx(styles.appNavBar__item, {
          [styles['appNavBar__item--active']]: activeTab === 'community',
        })}
        onClick={() => onTabChange('community')}
        aria-label="Community"
      >
        <span className={styles.appNavBar__icon}>
          <CommunityNavIcon />
        </span>
        <span className={styles.appNavBar__label}>Community</span>
      </button>

      <button
        className={clsx(styles.appNavBar__item, {
          [styles['appNavBar__item--active']]: activeTab === 'chat',
        })}
        onClick={() => onTabChange('chat')}
        aria-label="Chat"
      >
        <span className={styles.appNavBar__icon}>
          <ChatNavIcon />
        </span>
        <span className={styles.appNavBar__label}>Chat</span>
        {chatBadgeCount != null && chatBadgeCount > 0 && (
          <span className={styles.appNavBar__badge}>
            {chatBadgeCount > 99 ? '99+' : chatBadgeCount}
          </span>
        )}
      </button>
    </nav>
  );
};

export default AppNavBar;
