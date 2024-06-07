import React from 'react';
import styles from './ReactionList.module.css';
import ReactionListSkeleton from '~/v4/icons/ReactionListSkeleton';
import clsx from 'clsx';

export const ReactionListLoadingState = () => {
  return (
    <div
      className={clsx(styles.reactionCustomStateContainer, styles.loadingState)}
      data-qa-anchor="reaction_list"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <ReactionListSkeleton key={`loading_${index}`} />
      ))}
    </div>
  );
};
