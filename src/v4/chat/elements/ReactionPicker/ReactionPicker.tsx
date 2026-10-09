import { useState } from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { AmityReactionType, useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { Typography } from '~/v4/core/components';
import { FallbackReaction } from '~/v4/core/design/icons/FallbackReaction';
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
  // The picker asked no module anything. With Reaction off the badge on a
  // message disappeared — that one is gated — but long-pressing the bubble
  // still offered the whole picker, and pressing an emoji still wrote a
  // reaction. Measured on both viewports before this line existed.
  //
  // `message_reaction_picker` is the table's own id for this element, and it
  // was one of the ids no Web code declared: the table named the surface and
  // nothing here answered to it.
  const { isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId: 'message_reaction_picker',
  });
  const { reactions: config, getChatReactionLabel } = useCustomReaction();
  const [erroredReactions, setErroredReactions] = useState<Set<string>>(new Set());

  const onClickReaction = (reactionName: AmityReactionType['name']) => {
    onReactionClick(reactionName);
    onSelectReaction && onSelectReaction(reactionName);
  };

  // Below every hook this component calls, so flipping the flag cannot change
  // the hook count on a re-render (EX-15).
  if (isExcluded) return null;
  if (!config || config.length === 0) return null;

  return (
    <div className={styles.reactionPickerContainer} data-position={position}>
      {config.map((reaction, index) => {
        return (
          <button
            key={reaction.name}
            onClick={() => {
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
                {getChatReactionLabel(reaction.name)}
              </Typography.Caption>
              {reaction.image && !erroredReactions.has(reaction.name) ? (
                <img
                  data-active={myReaction === reaction.name}
                  src={reaction.image}
                  alt={reaction.name}
                  className={styles.reactionButton__icon}
                  onError={() => setErroredReactions((prev) => new Set(prev).add(reaction.name))}
                  data-testid={`${pageId}/${componentId}/reaction-picker-icon-${index}`}
                />
              ) : (
                <FallbackReaction
                  data-active={myReaction === reaction.name}
                  className={styles.reactionButton__icon}
                  data-testid={`${pageId}/${componentId}/reaction-picker-icon-${index}`}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
