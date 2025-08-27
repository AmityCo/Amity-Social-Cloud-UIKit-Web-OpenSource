import React, { useMemo, useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import { useReactionsCollection } from '~/v4/social/hooks/collections/useReactionsCollection';
import { Typography } from '~/v4/core/components';
import { useCustomReaction, AmityReactionType } from '~/v4/core/providers/CustomReactionProvider';
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
import { CloseButton } from '~/v4/social/elements';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import styles from './ReactionList.module.css';

interface ReactionListProps {
  pageId: string;
  referenceId: string;
  referenceType: Amity.ReactableType;
  customReferenceType?: string; // to customize reply text reactions
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
  referenceType,
  error,

  customReferenceType,
}: {
  filteredReactions: Amity.Reactor[];
  isLoading: boolean;
  hasMore: boolean | undefined;
  loadMore: () => void;
  removeReaction: (reaction: string) => Promise<void>;
  referenceType?: string;
  error: Error | null;

  customReferenceType?: string;
}) => {
  if (error) {
    return <ReactionListError />;
  }

  if (filteredReactions.length === 0) {
    if (isLoading) {
      return <ReactionListLoadingState />;
    }

    return <ReactionListEmptyState referenceType={customReferenceType ?? referenceType} />;
  }

  return (
    <ReactionListPanel
      hasMore={hasMore}
      loadMore={loadMore}
      isLoading={isLoading}
      filteredReactions={filteredReactions}
      removeReaction={removeReaction}
    />
  );
};

export const ReactionList = ({
  pageId = '*',
  referenceId,
  referenceType,
  customReferenceType,
}: ReactionListProps) => {
  const componentId = 'reaction_list';
  const { accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  const {
    reactions,
    error,
    loading: isLoading,
    hasMore,
    loadMore,
    refresh,
  } = useReactionsCollection({
    referenceId,
    referenceType,
    limit: 25,
  });

  const { reactions: allReacted, reactionCount } = useReactionByReference(
    referenceType,
    referenceId,
  );

  const { closePopup } = usePopupContext();
  const [activeTab, setActiveTab] = useState('All');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { socialReactions: config } = useCustomReaction();
  const { removeReaction } = useReaction(referenceType, referenceId);
  const { isDesktop } = useResponsive();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      // If scrolling horizontally, don't interfere
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // If there's horizontal scroll space available, convert vertical scroll to horizontal
      if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, [isDesktop]);

  const allConfigReactions = useMemo(
    () => (config ? config.map((reactionConfigItem) => reactionConfigItem.name) : []),
    [config],
  );

  const unknownReaction = useMemo(
    () =>
      Object.keys(allReacted).filter((reaction) => {
        return !allConfigReactions.includes(reaction);
      }),
    [allReacted, allConfigReactions],
  );

  const totalUnknownReactionCount = useMemo(
    () => unknownReaction.reduce((acc, curr) => acc + allReacted[curr], 0),
    [allReacted, unknownReaction],
  );

  const sortedReactionTabs = useMemo(() => {
    if (!config) return [];

    // Sort known reactions by count (highest to lowest)
    const sortedKnownReactions = config
      .filter((reactionConfigItem) => allReacted[reactionConfigItem.name])
      .sort((a, b) => allReacted[b.name] - allReacted[a.name]);

    const tabsWithCounts: Array<{
      reaction?: AmityReactionType;
      count: number;
      isUnknown: boolean;
    }> = sortedKnownReactions.map((reaction) => ({
      reaction,
      count: allReacted[reaction.name],
      isUnknown: false,
    }));

    if (unknownReaction.length > 0) {
      const unknownTabItem = {
        count: totalUnknownReactionCount,
        isUnknown: true,
      };

      let insertIndex = tabsWithCounts.length;
      for (let i = 0; i < tabsWithCounts.length; i++) {
        if (totalUnknownReactionCount > tabsWithCounts[i].count) {
          insertIndex = i;
          break;
        }
      }
      tabsWithCounts.splice(insertIndex, 0, unknownTabItem);
    }

    return tabsWithCounts;
  }, [config, allReacted, unknownReaction, totalUnknownReactionCount]);

  const filteredReactions = useMemo(
    () => filterReactionsByTab(reactions || [], activeTab, allConfigReactions),
    [reactions, activeTab, allConfigReactions],
  );

  const shouldShowAllTab = sortedReactionTabs.length > 1;

  useEffect(() => {
    if (!shouldShowAllTab && sortedReactionTabs.length === 1) {
      const firstTab = sortedReactionTabs[0];
      if (firstTab.isUnknown) {
        setActiveTab(UNKNOWN_TAB);
      } else if (firstTab.reaction && firstTab.reaction.name) {
        setActiveTab(firstTab.reaction.name);
      }
    }
  }, [shouldShowAllTab, sortedReactionTabs]);

  if (!config) return null;

  if (reactions == null && !isLoading) return null;

  return (
    <div className={styles.reactionListContainer} data-testid={`${accessibilityId}_header`}>
      <div className={styles.tabListContainer}>
        <div ref={scrollContainerRef} className={styles.tabListScrollContainer}>
          <div className={styles.tabList} data-testid={`${accessibilityId}_tab`}>
            {shouldShowAllTab && (
              <div
                data-active={activeTab === 'All'}
                className={styles.tabItem}
                onClick={() => handleTabClick('All')}
              >
                <Typography.BodyBold>
                  <span className={styles.reactionEmoji}>All {abbreviateCount(reactionCount)}</span>
                </Typography.BodyBold>
              </div>
            )}

            {sortedReactionTabs.map((tabItem) => {
              if (tabItem.isUnknown) {
                return (
                  <div
                    key={UNKNOWN_TAB}
                    data-active={activeTab === UNKNOWN_TAB}
                    className={styles.tabItem}
                    onClick={() => handleTabClick(UNKNOWN_TAB)}
                  >
                    <Typography.BodyBold>
                      <span className={styles.reactionEmoji}>
                        <FallbackReaction
                          className={clsx(styles.reactionIcon, styles.reactionIcon__fallbackIcon)}
                        />
                        {abbreviateCount(totalUnknownReactionCount)}
                      </span>
                    </Typography.BodyBold>
                  </div>
                );
              }

              const { name: reactionType } = tabItem.reaction!;
              return (
                <div
                  key={reactionType}
                  data-active={activeTab === reactionType}
                  className={styles.tabItem}
                  onClick={() => handleTabClick(reactionType)}
                >
                  <Typography.BodyBold>
                    <span className={styles.reactionEmoji}>
                      <ReactionIcon
                        className={styles.reactionItem}
                        reactionConfigItem={tabItem.reaction!}
                      />
                      {abbreviateCount(allReacted[reactionType])}
                    </span>
                  </Typography.BodyBold>
                </div>
              );
            })}
          </div>
        </div>
        <CloseButton
          className={styles.closeButton}
          defaultClassName={styles.closeButton__icon}
          onPress={() => closePopup()}
        />
      </div>

      <div className={styles.reactionPanel}>
        {isLoading && reactions?.length === 0 && <ReactionListLoadingState />}
        <RenderCondition
          hasMore={hasMore}
          loadMore={loadMore}
          error={error}
          isLoading={isLoading}
          filteredReactions={filteredReactions}
          removeReaction={removeReaction}
          referenceType={referenceType}
          customReferenceType={customReferenceType}
        />
      </div>
    </div>
  );
};
