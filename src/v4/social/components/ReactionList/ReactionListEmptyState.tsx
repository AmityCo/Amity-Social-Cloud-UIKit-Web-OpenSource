import React from 'react';
import { Typography } from '~/v4/core/components';
import SmilePlus from '~/v4/icons/SmilePlus';
import styles from './ReactionList.module.css';

type ReactionListEmptyStateProps = {
  referenceType?: string;
};

export const ReactionListEmptyState = ({
  referenceType = 'message',
}: ReactionListEmptyStateProps) => {
  return (
    <div className={styles.reactionCustomStateContainer} data-testid="reaction_list">
      <div className={styles.reactionState}>
        <SmilePlus className={styles.reactionListEmptyState__smileIcon} />
        <div className={styles.reactionState2Line}>
          <Typography.Body className={styles.reactionListEmptyState__caption}>
            No reactions yet
          </Typography.Body>
          <Typography.Caption
            className={styles.reactionListEmptyState__caption}
          >{`Be the first to react to this ${referenceType}!`}</Typography.Caption>
        </div>
      </div>
    </div>
  );
};
