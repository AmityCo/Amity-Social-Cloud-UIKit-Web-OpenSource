import React, { useState } from 'react';
import styles from './ReactionList.module.css';
import { useReactionsCollection } from '~/v4/social/hooks/collections/useReactionsCollection';
import { Typography } from '~/v4/core/components';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { abbreviateCount } from '~/v4/utils/abbreviateCount';
import { ReactionIcon } from '~/v4/social/components/ReactionList/ReactionIcon';
import { ReactionListPanel } from '~/v4/social/components/ReactionList/ReactionListPanel';
import { ReactionListError } from '~/v4/social/components/ReactionList/ReactionListError';
import { ReactionListEmptyState } from '~/v4/social/components/ReactionList/ReactionListEmptyState';
import { ReactionListLoadingState } from '~/v4/social/components/ReactionList/ReactionListLoadingState';

interface ReactionListProps {
  pageId: string;
  referenceId: string;
  referenceType: Amity.ReactableType;
}

const RenderCondition = ({
  filteredReactions,
  isLoading,
  error,
}: {
  filteredReactions: Amity.Reactor[];
  isLoading: boolean;
  error: Error | null;
}) => {
  if (isLoading) {
    return <ReactionListLoadingState />;
  }

  if (error) {
    return <ReactionListError />;
  }

  if (filteredReactions.length === 0) {
    return <ReactionListEmptyState />;
  }

  return <ReactionListPanel filteredReactions={filteredReactions} />;
};

export const ReactionList = ({ pageId = '*', referenceId, referenceType }: ReactionListProps) => {
  const componentId = 'reaction_list';
  const { reactions, error, isLoading } = useReactionsCollection({ referenceId, referenceType });
  const [activeTab, setActiveTab] = useState('All');
  const { config } = useCustomReaction();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const filteredReactions =
    activeTab === 'All'
      ? reactions
      : reactions.filter((reaction) => reaction.reactionName === activeTab.toLowerCase());

  if (reactions == null || !config) return null;

  return (
    <div className={styles.reactionListContainer} data-qa-anchor="reaction_list_header">
      <div className={styles.tabList} data-qa-anchor="reaction_list_tab">
        <div
          className={`${styles.tabItem} ${activeTab === 'All' ? styles.active : ''}`}
          onClick={() => handleTabClick('All')}
        >
          <Typography.Body>
            <span className={styles.reactionEmoji}>All {abbreviateCount(reactions.length)}</span>
          </Typography.Body>
        </div>

        {config.map((reactionConfigItem) => {
          const { name: reactionType, image } = reactionConfigItem;

          const count = reactions.filter(
            (reaction) => reaction.reactionName === reactionType,
          ).length;

          return (
            <div
              key={reactionType}
              className={`${styles.tabItem} ${activeTab === reactionType ? styles.active : ''}`}
              onClick={() => handleTabClick(reactionType)}
            >
              <Typography.Body>
                <span className={styles.reactionEmoji}>
                  <ReactionIcon
                    className={styles.reactionItem}
                    reactionConfigItem={reactionConfigItem}
                  />
                  {abbreviateCount(count)}
                </span>
              </Typography.Body>
            </div>
          );
        })}
      </div>

      <RenderCondition error={error} isLoading={isLoading} filteredReactions={filteredReactions} />
    </div>
  );
};
