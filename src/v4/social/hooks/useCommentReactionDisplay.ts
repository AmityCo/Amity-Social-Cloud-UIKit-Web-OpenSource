import { useMemo } from 'react';
import { AmityReactionType, useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';

interface UseCommentReactionDisplayProps {
  comment: Amity.Comment;
}

export const useCommentReactionDisplay = ({ comment }: UseCommentReactionDisplayProps) => {
  const { socialReactions } = useCustomReaction();

  const allConfigReactions = useMemo(
    () => socialReactions.map((reactionConfigItem) => reactionConfigItem.name),
    [socialReactions],
  );

  const configuredReactions = useMemo(() => {
    if (!socialReactions || !comment?.reactions) return [];

    return socialReactions
      .filter((reaction) => comment.reactions[reaction.name] > 0)
      .sort((a, b) => {
        const countA = comment.reactions[a.name] || 0;
        const countB = comment.reactions[b.name] || 0;

        // First sort by count (descending)
        if (countB !== countA) {
          return countB - countA;
        }

        // If counts are equal, sort alphabetically by reaction name (ascending)
        return a.name.localeCompare(b.name);
      });
  }, [socialReactions, comment?.reactions]);

  const unknownReactions = useMemo(() => {
    if (!comment?.reactions) return [];

    return Object.keys(comment.reactions).filter(
      (reactionType) =>
        !allConfigReactions.includes(reactionType) && comment.reactions[reactionType] > 0,
    );
  }, [comment?.reactions, allConfigReactions]);

  const sortedReactions = useMemo(() => {
    if (!comment?.reactions) return [];

    // Combine configured and unknown reactions with their counts
    const allReactions = [
      ...configuredReactions.map((reaction: AmityReactionType) => ({
        type: 'configured' as const,
        reaction,
        count: comment.reactions[reaction.name] || 0,
      })),
      ...unknownReactions.map((reactionName: string) => ({
        type: 'unknown' as const,
        reactionName,
        count: comment.reactions[reactionName] || 0,
      })),
    ];

    return allReactions.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      const nameA = a.type === 'configured' ? a.reaction.name : a.reactionName;
      const nameB = b.type === 'configured' ? b.reaction.name : b.reactionName;
      return nameA.localeCompare(nameB);
    });
  }, [configuredReactions, unknownReactions, comment?.reactions]);

  const hasReaction = sortedReactions.length > 0;

  return {
    configuredReactions,
    unknownReactions,
    sortedReactions,
    hasReaction,
  };
};
