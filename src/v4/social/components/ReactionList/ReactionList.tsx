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
import useReaction from '~/v4/chat/hooks/useReaction';

interface ReactionListProps {
  pageId: string;
  referenceId: string;
  referenceType: Amity.ReactableType;
}

const RenderCondition = ({
  filteredReactions,
  isLoading,
  removeReaction,
  error,
}: {
  filteredReactions: Amity.Reactor[];
  isLoading: boolean;
  removeReaction: (reaction: string) => Promise<void>;
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

  return (
    <ReactionListPanel filteredReactions={filteredReactions} removeReaction={removeReaction} />
  );
};

export const ReactionList = ({ pageId = '*', referenceId, referenceType }: ReactionListProps) => {
  const componentId = 'reaction_list';
  const { reactions, error, isLoading } = useReactionsCollection({ referenceId, referenceType });
  const [activeTab, setActiveTab] = useState('All');
  const { config } = useCustomReaction();
  const { removeReaction } = useReaction(referenceType, referenceId);

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
      <div className={styles.tabListContainer}>
        <div className={styles.tabList} data-qa-anchor="reaction_list_tab">
          <div
            data-active={activeTab === 'All'}
            className={styles.tabItem}
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

            if (!count) return null;

            return (
              <div
                key={reactionType}
                data-active={activeTab === reactionType}
                className={styles.tabItem}
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
      </div>

      <RenderCondition
        error={error}
        isLoading={isLoading}
        filteredReactions={filteredReactions}
        removeReaction={removeReaction}
      />
    </div>
  );
};
