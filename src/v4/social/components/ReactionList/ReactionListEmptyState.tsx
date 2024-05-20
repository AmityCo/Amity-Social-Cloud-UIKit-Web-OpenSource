import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './ReactionList.module.css';
import { Typography } from '~/v4/core/components';
import SmilePlus from '~/v4/icons/SmilePlus';

export const ReactionListEmptyState = () => {
  return (
    <div className={styles.reactionCustomStateContainer} data-qa-anchor="reaction_list">
      <div className={styles.reactionState}>
        <SmilePlus />
        <div className={styles.reactionState2Line}>
          <Typography.Body>
            <FormattedMessage id="livechat.reaction.emptyState" />
          </Typography.Body>
          <Typography.Caption>
            <FormattedMessage id="livechat.reaction.emptyState.description" />
          </Typography.Caption>
        </div>
      </div>
    </div>
  );
};
