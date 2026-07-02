import React from 'react';
import clsx from 'clsx';
import millify from 'millify';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { useCommentReactionDisplay } from '~/v4/social/hooks/useCommentReactionDisplay';
import styles from './CommentReactionDisplay.module.css';

interface CommentReactionDisplayProps {
  pageId?: string;
  componentId?: string;
  comment: Amity.Comment;
  reactionsCount: number;
  onReactionPress: () => void;
  position?: 'comment' | 'replyComment' | 'inline';
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
  const { sortedReactions, hasReaction } = useCommentReactionDisplay({ comment });

  if (reactionsCount <= 0) return null;

  const containerClassName = clsx(
    styles.commentReactionDisplay,
    styles[`commentReactionDisplay--${position}`],
    className,
  );

  // Inline (in the action row) mirrors the post reaction bar: count first, then
  // the stacked reaction icons, right-aligned with no pill chrome.
  const isInline = position === 'inline';
  const reactionCount = (
    <Typography.CaptionBold
      data-testid={`${pageId}/${componentId}/comment-reaction-count`}
      className={styles.commentReactionDisplay__reactionCount}
    >
      {millify(reactionsCount)}
    </Typography.CaptionBold>
  );

  return (
    <Button
      data-testid={`${pageId}/${componentId}/comment-reaction-list-button`}
      variant="default"
      className={containerClassName}
      onPress={onReactionPress}
    >
      {isInline && reactionCount}
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
      {!isInline && reactionCount}
    </Button>
  );
};
