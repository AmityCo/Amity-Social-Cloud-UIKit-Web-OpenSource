import React, { useMemo } from 'react';
import { useFeatureEnabled } from '~/v4/core/providers/CustomizationProvider';
import styles from './styles.module.css';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { FallbackReaction } from '~/v4/core/design/icons/FallbackReaction';
import { abbreviateCount } from '~/v4/utils/abbreviateCount';

export const MessageReactionPreview = ({
  message,
  onClick,
}: {
  message: Amity.Message;
  onClick?: () => void;
}) => {
  // A reaction surface with no page or component context threaded in, so it
  // asks the module rather than an element id. Switching Reaction off left
  // every one of these drawing: the module has to be off on messages,
  // replies and livestream chat too, not only on posts.
  const reactionEnabled = useFeatureEnabled('reaction');

  const { reactions: reactionConfig } = useCustomReaction();
  // find the top 3 reactions. useMemo unconditionally — it sat behind
  // `message.reactions ? …` and vanished from the hook order on any message
  // that had no reactions yet.
  const topReactions = useMemo(
    () =>
      Object.entries(message.reactions ?? {})
        .sort((a, b) => b[1] - a[1]) // sort by value in descending order
        // remove reaction that has zero value
        .filter((reaction) => reaction[1] > 0)
        .slice(0, 3)
        .sort((a, b) => a[1] - b[1]),
    [message?.reactions],
  );

  // Asked as a value, not an early return: a hook cannot be skipped. Returning
  // above the hooks above changed the hook count when the module was toggled at
  // runtime, which is what the sample app's Modules screen does.
  if (!reactionEnabled) return null;

  if (!message?.reactionsCount) return null;

  return (
    <div
      className={styles.reactionPreviewContainer}
      data-myreaction={message?.myReactions && !!message?.myReactions.length}
      onClick={onClick}
    >
      <div className={styles.reactionIconContainer}>
        {topReactions.map((reaction) => {
          const reactionMapConfig = reactionConfig.find((config) => config.name === reaction[0]);
          return (
            <>
              {reactionMapConfig ? (
                <img
                  className={styles.reactionIcon}
                  src={reactionMapConfig.image}
                  alt={reactionMapConfig.name}
                />
              ) : (
                <FallbackReaction className={styles.fallbackIcon} />
              )}
            </>
          );
        })}
      </div>
      <div className={styles.reactionCount}>{abbreviateCount(message.reactionsCount)}</div>
    </div>
  );
};
