import React, { useMemo } from 'react';
import styles from './styles.module.css';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { abbreviateCount } from '~/v4/utils/abbreviateCount';

export const MessageReactionPreview = ({
  message,
  onClick,
}: {
  message: Amity.Message;
  onClick?: () => void;
}) => {
  const { config: reactionConfig } = useCustomReaction();
  // find the top 3 reactions
  const topReactions = useMemo(
    () =>
      Object.entries(message.reactions)
        .sort((a, b) => b[1] - a[1]) // sort by value in descending order
        // remove reaction that has zero value
        .filter((reaction) => reaction[1] > 0)
        .slice(0, 3)
        .sort((a, b) => a[1] - b[1]),
    [message.reactions],
  );

  if (!message.reactionsCount) return null;

  return (
    <div
      className={styles.reactionPreviewContainer}
      data-myreaction={message.myReactions && !!message.myReactions.length}
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
                <FallbackReaction
                  className={styles.fallbackIcon}
                  backgroundColor={getComputedStyle(document.documentElement).getPropertyValue(
                    '--asc-color-base-shade3',
                  )}
                />
              )}
            </>
          );
        })}
      </div>
      <div className={styles.reactionCount}>{abbreviateCount(message.reactionsCount)}</div>
    </div>
  );
};
