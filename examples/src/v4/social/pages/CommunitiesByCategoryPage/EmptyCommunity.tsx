import React from 'react';
import { CommunityEmptyTitle } from '~/v4/social/elements/CommunityEmptyTitle';
import { CommunityEmptyImage } from '~/v4/social/elements/CommunityEmptyImage';

import styles from './EmptyCommunity.module.css';

export const EmptyCommunity = ({ pageId }: { pageId: string }) => {
  return (
    <div className={styles.emptyCommunity}>
      <CommunityEmptyImage />
      <CommunityEmptyTitle pageId={pageId} />
    </div>
  );
};
