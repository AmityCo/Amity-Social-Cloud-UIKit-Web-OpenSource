import React from 'react';
import { Typography } from '~/v4/core/components';
import Redo from '~/v4/icons/Redo';
import styles from './ReactionList.module.css';

export const ReactionListError = () => {
  return (
    <div className={styles.reactionCustomStateContainer} data-testid="reaction_list">
      <div className={styles.reactionState}>
        <Redo className={styles.retryIcon} />
        <Typography.Body>Unable to load reactions</Typography.Body>
      </div>
    </div>
  );
};
