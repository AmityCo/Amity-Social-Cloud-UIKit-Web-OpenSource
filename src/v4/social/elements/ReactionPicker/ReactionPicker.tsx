import React from 'react';
import { AmityReactionType, useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { Button } from '~/v4/core/components/AriaButton';
import { Typography } from '~/v4/core/components';
import styles from './ReactionPicker.module.css';

export interface ReactionPickerProps {
  myReaction?: string | null;
  onReactionClick: (reactionName: string) => void;
  onSelectReaction?: (reactionName: string) => void;
  onReactionHover?: (reactionName: string | null) => void;
  position?: 'above' | 'below';
  hoveredReaction?: string | null;
}

export const ReactionPicker = ({
  myReaction,
  onReactionClick,
  onSelectReaction,
  onReactionHover,
  position = 'above',
  hoveredReaction,
}: ReactionPickerProps) => {
  const { socialReactions: config } = useCustomReaction();

  const onClickReaction = (reactionName: AmityReactionType['name']) => {
    onReactionClick(reactionName);
    onSelectReaction && onSelectReaction(reactionName);
  };

  if (!config) return null;

  return (
    <div className={styles.reactionPickerContainer} data-position={position}>
      {config.map((reaction) => {
        return (
          <Button
            key={reaction.name}
            variant="default"
            onPress={() => {
              onClickReaction(reaction.name);
            }}
            className={styles.reactionButton}
            data-reaction-name={reaction.name}
            data-touch-hovered={hoveredReaction === reaction.name}
          >
            <div
              data-active={myReaction === reaction.name}
              className={styles.reactionButton__activeBackground}
            />

            <div
              onMouseEnter={() => onReactionHover?.(reaction.name)}
              onMouseLeave={() => onReactionHover?.(null)}
              className={styles.reactionButton__iconContainer}
            >
              <Typography.Caption className={styles.reactionButton__text}>
                {reaction.name}
              </Typography.Caption>
              <img
                data-active={myReaction === reaction.name}
                src={reaction.image}
                alt={reaction.name}
                className={styles.reactionButton__icon}
              />
            </div>
          </Button>
        );
      })}
    </div>
  );
};
