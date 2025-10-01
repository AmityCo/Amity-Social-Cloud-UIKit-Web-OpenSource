import React, { useCallback } from 'react';
import { Button } from '~/v4/core/components/AriaButton';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { LiveReactionRepository } from '@amityco/ts-sdk';
import styles from './styles.module.css';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';

interface ReactionBarProps {
  targetType: string;
  targetId: string;
  streamId?: string;
  isJoinedCommunity?: boolean;
}

export const ReactionBar = ({
  targetType,
  targetId,
  streamId,
  isJoinedCommunity,
}: ReactionBarProps) => {
  const { reactions: config } = useCustomReaction();
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();

  if (!config || !targetId) return null;

  const onReactionClick = useCallback(
    (reactionName: string) => {
      if (streamId)
        LiveReactionRepository.createReaction({
          referenceId: targetId,
          referenceType: targetType,
          reactionName: reactionName,
          streamId,
        });
    },
    [targetId, targetType, streamId],
  );

  const handleReactionClick = (reactionName: string) => {
    return handleCommunityProfileBehavior({
      defaultBehavior: () => onReactionClick(reactionName),
      allowNonMember: false,
      isJoined: isJoinedCommunity,
    });
  };

  return (
    <div className={styles.reactionBarContainer}>
      {config.map((reaction) => {
        return (
          <Button variant="text">
            <img
              key={reaction.name}
              src={reaction.image}
              alt={reaction.name}
              className={styles.reactionButton}
              onClick={() => {
                handleReactionClick(reaction.name);
              }}
            />
          </Button>
        );
      })}
    </div>
  );
};
