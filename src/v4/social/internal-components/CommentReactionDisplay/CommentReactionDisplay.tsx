import React from 'react';
import clsx from 'clsx';
import millify from 'millify';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useCommentReactionDisplay } from '~/v4/social/hooks/useCommentReactionDisplay';
import styles from './CommentReactionDisplay.module.css';

interface CommentReactionDisplayProps {
  pageId?: string;
  componentId?: string;
  comment: Amity.Comment;
  reactionsCount: number;
  onReactionPress: () => void;
  position?: 'comment' | 'replyComment';
  className?: string;
}

export const CommentReactionDisplay = ({
  pageId = '*',
  componentId = '*',
  comment,
  reactionsCount,
  onReactionPress,
  position = 'comment',
  className,
}: CommentReactionDisplayProps) => {
  // A reaction chip on a comment is a Reaction surface, and this one carried no
  // gate: switching Reaction off removed the Like control and the post's count
  // and left every comment and reply still showing theirs. Same id Android uses
  // for the same chip, so the three platforms answer this the same way.
  const { isExcluded } = useAmityElement({ pageId, componentId, elementId: 'reaction_preview' });
  const { sortedReactions, hasReaction } = useCommentReactionDisplay({ comment });

  if (isExcluded) return null;
  if (reactionsCount <= 0) return null;

  const containerClassName = clsx(
    styles.commentReactionDisplay,
    styles[`commentReactionDisplay--${position}`],
    className,
  );

  return (
    <Button
      data-testid={`${pageId}/${componentId}/comment-reaction-list-button`}
      variant="default"
      className={containerClassName}
      onPress={onReactionPress}
    >
      {hasReaction ? (
        <div className={styles.commentReactionDisplay__reactions}>
          {sortedReactions.map((item) =>
            item.type === 'configured' ? (
              <img
                key={item.reaction.name}
                src={item.reaction.image}
                alt={item.reaction.name}
                className={styles.commentReactionDisplay__icon}
                data-testid={`${pageId}/${componentId}/${item.reaction.name}-button`}
              />
            ) : (
              <FallbackReaction
                key={item.reactionName}
                className={styles.commentReactionDisplay__iconFallback}
                backgroundColor={getComputedStyle(document.documentElement).getPropertyValue(
                  '--asc-color-base-shade3',
                )}
                data-testid={`${item.reactionName}-button`}
              />
            ),
          )}
        </div>
      ) : null}
      <Typography.CaptionBold
        data-testid={`${pageId}/${componentId}/comment-reaction-count`}
        className={styles.commentReactionDisplay__reactionCount}
      >
        {millify(reactionsCount)}
      </Typography.CaptionBold>
    </Button>
  );
};
