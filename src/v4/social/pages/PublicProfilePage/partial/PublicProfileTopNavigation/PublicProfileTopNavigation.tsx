import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './PublicProfileTopNavigation.module.css';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import { DotsIcon } from '~/icons';

type PublicProfileTopNavigationProps = {
  pageTitle?: string;
  onBackFunc?: () => void;
};

const PublicProfileTopNavigation: React.FC<PublicProfileTopNavigationProps> = ({
  pageTitle,
  onBackFunc,
}) => {
  return (
    <div className={styles.topNavigation}>
      <ChevronLeft width={16} height={16} fill="#000" stroke="#000" onClick={onBackFunc} />

      <span onClick={() => {}}>
        <DotsIcon width={16} height={16} fill="#000" stroke="#000" />
      </span>
    </div>
  );
};

export default PublicProfileTopNavigation;
