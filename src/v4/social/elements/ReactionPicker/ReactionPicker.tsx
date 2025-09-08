import React from 'react';
import { AmityReactionType, useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { Button } from '~/v4/core/components/AriaButton';
import { Typography } from '~/v4/core/components';
import styles from './ReactionPicker.module.css';

export interface ReactionPickerProps {
  pageId?: string;
  componentId?: string;
  myReaction?: string | null;
  onReactionClick: (reactionName: string) => void;
  onSelectReaction?: (reactionName: string) => void;
  onReactionHover?: (reactionName: string | null) => void;
  position?: 'above' | 'below';
  hoveredReaction?: string | null;
}

export const ReactionPicker = ({
  pageId = '*',
  componentId = '*',
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
      {config.map((reaction, index) => {
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
            data-testid={`${pageId}/${componentId}/reaction-picker-${index}`}
          >
            <div
              data-active={myReaction === reaction.name}
              className={styles.reactionButton__activeBackground}
            />

            <div
              onMouseEnter={() => onReactionHover?.(reaction.name)}
              onMouseLeave={() => onReactionHover?.(null)}
              className={styles.reactionButton__iconContainer}
              role="button"
              tabIndex={0}
              aria-label="Reaction picker"
            >
              <Typography.Caption
                testId={`${pageId}/${componentId}/reaction-picker-label-${index}`}
                className={styles.reactionButton__text}
              >
                {reaction.name}
              </Typography.Caption>
              <img
                data-active={myReaction === reaction.name}
                src={reaction.image}
                alt={reaction.name}
                className={styles.reactionButton__icon}
                data-testid={`${pageId}/${componentId}/reaction-picker-icon-${index}`}
              />
            </div>
          </Button>
        );
      })}
    </div>
  );
};
