import React from 'react';
import clsx from 'clsx';
import millify from 'millify';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { useCommentReactionDisplay } from '~/v4/social/hooks/useCommentReactionDisplay';

interface CommentReactionDisplayProps {
  pageId: string;
  comment: Amity.Comment;
  reactionsCount: number;
  onReactionPress: () => void;
  className?: string;
  reactionsClassName?: string;
  iconClassName?: string;
  iconFallbackClassName?: string;
  reactionCountClassName?: string;
}

export const CommentReactionDisplay = ({
  pageId,
  comment,
  reactionsCount,
  onReactionPress,
  className,
  reactionsClassName,
  iconClassName,
  iconFallbackClassName,
  reactionCountClassName,
}: CommentReactionDisplayProps) => {
  const { sortedReactions, hasReaction } = useCommentReactionDisplay({ comment });

  if (reactionsCount <= 0) return null;

  return (
    <Button variant="default" className={className} onPress={onReactionPress}>
      {hasReaction ? (
        <div className={reactionsClassName}>
          {sortedReactions.map((item) =>
            item.type === 'configured' ? (
              <img
                key={item.reaction.name}
                src={item.reaction.image}
                alt={item.reaction.name}
                className={iconClassName}
              />
            ) : (
              <FallbackReaction
                key={item.reactionName}
                className={clsx(iconClassName, iconFallbackClassName)}
                backgroundColor={getComputedStyle(document.documentElement).getPropertyValue(
                  '--asc-color-base-shade3',
                )}
              />
            ),
          )}
        </div>
      ) : null}
      <Typography.CaptionBold className={reactionCountClassName}>
        {millify(reactionsCount)}
      </Typography.CaptionBold>
    </Button>
  );
};
