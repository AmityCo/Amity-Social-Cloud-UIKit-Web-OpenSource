import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './ReactionList.module.css';
import { Typography } from '~/v4/core/components';
import Redo from '~/v4/icons/Redo';

export const ReactionListError = () => {
  return (
    <div className={styles.reactionCustomStateContainer} data-testid="reaction_list">
      <div className={styles.reactionState}>
        <Redo className={styles.retryIcon} />
        <Typography.Body>
          <FormattedMessage id="livechat.reaction.errorOnload" />
        </Typography.Body>
      </div>
    </div>
  );
};
