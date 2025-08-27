import React from 'react';
import styles from './ReactionList.module.css';
import ReactionListSkeleton from '~/v4/icons/ReactionListSkeleton';
import clsx from 'clsx';

export const ReactionListLoadingState = ({ length }: { length?: number }) => {
  return (
    <div
      className={clsx(styles.reactionCustomStateContainer, styles.loadingState)}
      data-testid="reaction_list"
    >
      {Array.from({ length: length || 3 }).map((_, index) => (
        <ReactionListSkeleton key={`loading_${index}`} />
      ))}
    </div>
  );
};
