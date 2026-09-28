import React, { useCallback } from 'react';
import { useFeatureEnabled } from '~/v4/core/providers/CustomizationProvider';
import { Button } from '~/v4/core/design/components/Button';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { LiveReactionRepository } from '@amityco/ts-sdk';
import styles from './styles.module.css';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';

interface ReactionBarProps {
  targetType: string;
  targetId: string;
  roomId?: string;
  isJoinedCommunity?: boolean;
}

export const ReactionBar = ({
  targetType,
  targetId,
  roomId,
  isJoinedCommunity,
}: ReactionBarProps) => {
  // A reaction surface with no page or component context threaded in, so it
  // asks the module rather than an element id. Switching Reaction off left
  // every one of these drawing: the module has to be off on messages,
  // replies and livestream chat too, not only on posts.
  const reactionEnabled = useFeatureEnabled('reaction');

  const { reactions: config } = useCustomReaction();
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();

  const onReactionClick = useCallback(
    (reactionName: string) => {
      if (roomId)
        LiveReactionRepository.createReaction({
          referenceId: targetId,
          referenceType: targetType,
          reactionName: reactionName,
          roomId,
        });
    },
    [targetId, targetType, roomId],
  );

  // Both guards below the hooks: a hook cannot be skipped, and both of these
  // sat above useCallback — the hook count changed with the module toggle and
  // with any message that arrived before the reaction config did.
  if (!reactionEnabled) return null;
  if (!config || !targetId) return null;

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
