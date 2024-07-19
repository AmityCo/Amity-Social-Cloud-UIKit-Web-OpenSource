import React, { useMemo, useRef, useState } from 'react';
import { useReactionsCollection } from '~/v4/social/hooks/collections/useReactionsCollection';
import { Typography } from '~/v4/core/components';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { abbreviateCount } from '~/v4/utils/abbreviateCount';
import { ReactionIcon } from './ReactionIcon';
import { ReactionListPanel } from './ReactionListPanel';
import { ReactionListError } from './ReactionListError';
import { ReactionListEmptyState } from './ReactionListEmptyState';
import { ReactionListLoadingState } from './ReactionListLoadingState';
import useReaction from '~/v4/chat/hooks/useReaction';
import useReactionByReference from '~/v4/chat/hooks/useReactionByReference';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

import styles from './ReactionList.module.css';

interface ReactionListProps {
  pageId: string;
  referenceId: string;
  referenceType: Amity.ReactableType;
}

const UNKNOWN_TAB = 'unknown';

const filterReactionsByTab = (
  reactions: Amity.Reactor[],
  activeTab: string,
  allConfigReactions: string[],
) => {
  if (activeTab === 'All') return reactions;
  if (activeTab === UNKNOWN_TAB) {
    return reactions.filter((reaction) => !allConfigReactions.includes(reaction.reactionName));
  }
  return reactions.filter((reaction) => reaction.reactionName === activeTab.toLowerCase());
};

const RenderCondition = ({
  filteredReactions,
  hasMore,
  loadMore,
  isLoading,
  removeReaction,
  error,
  currentRef,
  showReactionUserDetails = false,
}: {
  filteredReactions: Amity.Reactor[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  removeReaction: (reaction: string) => Promise<void>;
  error: Error | null;
  currentRef: HTMLDivElement | null;
  showReactionUserDetails?: boolean;
}) => {
  if (isLoading) {
    return <ReactionListLoadingState />;
  }

  if (error) {
    return <ReactionListError />;
  }

  if (filteredReactions.length === 0) {
    if (isLoading) {
      return <ReactionListLoadingState />;
    }

    return <ReactionListEmptyState />;
  }

  return (
    <ReactionListPanel
      currentRef={currentRef}
      hasMore={hasMore}
      loadMore={loadMore}
      isLoading={isLoading}
      filteredReactions={filteredReactions}
      removeReaction={removeReaction}
      showReactionUserDetails={showReactionUserDetails}
    />
  );
};

export const ReactionList = ({ pageId = '*', referenceId, referenceType }: ReactionListProps) => {
  const componentId = 'reaction_list';
  const { accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  const { reactions, error, isLoading, hasMore, loadMore } = useReactionsCollection({
    referenceId,
    referenceType,
    limit: 25,
  });

  const { reactions: allReacted, reactionCount } = useReactionByReference(
    referenceType,
    referenceId,
  );

  const [activeTab, setActiveTab] = useState('All');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { config } = useCustomReaction();
  const { removeReaction } = useReaction(referenceType, referenceId);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  if (reactions == null || !config) return null;

  const allConfigReactions = useMemo(
    () => config.map((reactionConfigItem) => reactionConfigItem.name),
    [config],
  );

  const unknownReaction = useMemo(
    () =>
      Object.keys(allReacted).filter((reaction) => {
        return !allConfigReactions.includes(reaction);
      }),
    [allReacted],
  );

  const totalUnknownReactionCount = useMemo(
    () => unknownReaction.reduce((acc, curr) => acc + allReacted[curr], 0),
    [allReacted],
  );

  const filteredReactions = useMemo(
    () => filterReactionsByTab(reactions, activeTab, allConfigReactions),
    [reactions, activeTab],
  );

  return (
    <div className={styles.reactionListContainer} data-qa-anchor={`${accessibilityId}_header`}>
      <div className={styles.tabListContainer}>
        <div className={styles.tabList} data-qa-anchor={`${accessibilityId}_tab`}>
          <div
            data-active={activeTab === 'All'}
            className={styles.tabItem}
            onClick={() => handleTabClick('All')}
          >
            <Typography.Body>
              <span className={styles.reactionEmoji}>All {abbreviateCount(reactionCount)}</span>
            </Typography.Body>
          </div>

          {config.map((reactionConfigItem) => {
            const { name: reactionType, image } = reactionConfigItem;

            if (!allReacted[reactionType]) return null;

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
                    {abbreviateCount(allReacted[reactionType])}
                  </span>
                </Typography.Body>
              </div>
            );
          })}

          {unknownReaction.length > 0 && (
            <div
              key={UNKNOWN_TAB}
              data-active={activeTab === UNKNOWN_TAB}
              className={styles.tabItem}
              onClick={() => handleTabClick(UNKNOWN_TAB)}
            >
              <Typography.Body>
                <span className={styles.reactionEmoji}>
                  <FallbackReaction className={styles.reactionIcon} />
                  {abbreviateCount(totalUnknownReactionCount)}
                </span>
              </Typography.Body>
            </div>
          )}
        </div>
      </div>

      <div ref={containerRef} className={styles.reactionPanel}>
        <RenderCondition
          currentRef={containerRef.current}
          hasMore={hasMore}
          loadMore={loadMore}
          error={error}
          isLoading={isLoading}
          filteredReactions={filteredReactions}
          removeReaction={removeReaction}
        />
      </div>
    </div>
  );
};
