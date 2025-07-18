import React, { useCallback } from 'react';
import { Button } from '~/v4/core/components/AriaButton';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { LiveReactionRepository } from '@amityco/ts-sdk';
import styles from './styles.module.css';

interface ReactionBarProps {
  targetType: string;
  targetId: string;
  streamId?: string;
}

export const ReactionBar = ({ targetType, targetId, streamId }: ReactionBarProps) => {
  const { config } = useCustomReaction();

  if (!config || !targetId) return null;

  const onClickReaction = useCallback(
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

  return (
    <div className={styles.reactionPickerContainer}>
      {config.map((reaction) => {
        return (
          <Button variant="text">
            <img
              key={reaction.name}
              src={reaction.image}
              alt={reaction.name}
              className={styles.reactionButton}
              onClick={() => {
                onClickReaction(reaction.name);
              }}
            />
          </Button>
        );
      })}
    </div>
  );
};
