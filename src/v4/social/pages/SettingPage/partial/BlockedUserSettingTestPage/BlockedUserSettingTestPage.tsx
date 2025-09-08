import React, { useEffect, useState } from 'react';
import styles from './BlockedUserSettingTestPage.module.css';
import { BlockedUserPage } from '~/v4/social/pages/BlockedUserPage';

const BlockedUserSettingTestPage: React.FC = () => {
  const pageId = 'blocked_users_settings-test-page';

  return (
    <div className={styles.container}>
      <BlockedUserPage />
    </div>
  );
};

export default BlockedUserSettingTestPage;
