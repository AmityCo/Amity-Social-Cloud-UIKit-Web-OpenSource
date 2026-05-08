import React from 'react';
import { useString } from '~/v4/core/localization';
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
            {useString('amity_common_button_no_reactions_yet')}
          </Typography.Body>
          <Typography.Caption className={styles.reactionListEmptyState__caption}>
            {useString('amity_common_label_be_first_to_react', referenceType)}
          </Typography.Caption>
        </div>
      </div>
    </div>
  );
};
