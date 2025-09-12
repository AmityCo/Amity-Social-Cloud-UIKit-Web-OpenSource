import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './SettingTopNavigation.module.css';
import ChevronLeft from '~/v4/icons/ChevronLeft';

type SettingTopNavigationProps = {
  pageTitle?: string;
  onBackFunc: () => void;
};

const SettingTopNavigation: React.FC<SettingTopNavigationProps> = ({ pageTitle, onBackFunc }) => {
  return (
    <div className={styles.topNavigation}>
      <ChevronLeft
        width={16}
        height={16}
        fill="#000"
        stroke="#000"
        onClick={onBackFunc}
        className={styles.hiddenOnDesktop}
      />
      <Typography.SubTitleBold>{pageTitle}</Typography.SubTitleBold>
      <span className={styles.hiddenOnDesktop} />
    </div>
  );
};

export default SettingTopNavigation;
