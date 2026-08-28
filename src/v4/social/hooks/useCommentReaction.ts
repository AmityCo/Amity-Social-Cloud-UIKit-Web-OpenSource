import { ReactionRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { resolveString } from '~/v4/core/localization';

interface UseCommentReactionParams {
  comment: Amity.Comment;
}

interface UseCommentReactionReturn {
  reactionByMe: string | null;
  reactionsCount: number;
  mutateAddReactionAsync: (
    reactionKey: string,
  ) => ReturnType<typeof ReactionRepository.addReaction>;
  mutateRemoveReactionAsync: (
    reactionKey: string,
  ) => ReturnType<typeof ReactionRepository.removeReaction>;
  setReactionByMe: (reaction: string | null) => void;
}

export const useCommentReaction = ({
  comment,
}: UseCommentReactionParams): UseCommentReactionReturn => {
  const [reactionsCount, setReactionsCount] = useState(0);
  const [shouldSubscribe, setShouldSubscribe] = useState(false);
  const [reactionByMe, setReactionByMe] = useState<string | null>(null);
  const { info } = useNotifications();

  useEffect(() => {
    if (comment == null) return;
    setReactionByMe(comment.myReactions?.[0] || null);
  }, [comment?.myReactions]);

  useEffect(() => {
    if (comment == null) return;
    setReactionsCount(comment?.reactionsCount || 0);
  }, [comment?.reactionsCount]);

  const { mutateAsync: mutateAddReactionAsync } = useMutation({
    mutationFn: async (reactionKey: string) => {
      if (reactionByMe && reactionByMe !== reactionKey) {
        try {
          setReactionByMe(reactionKey);
          await ReactionRepository.removeReaction('comment', comment?.commentId, reactionByMe);
        } catch (err) {
          info({
            content: resolveString('amity_social_toast_failed_generic'),
          });
        }
      }
      return ReactionRepository.addReaction('comment', comment?.commentId, reactionKey);
    },

    onMutate: (reactionKey) => {
      setShouldSubscribe(true);
      if (!reactionByMe) {
        setReactionsCount(reactionsCount + 1);
      }
      setReactionByMe(reactionKey);
    },

    onError: () => {
      setReactionByMe(comment?.myReactions?.[0] || null);
      setReactionsCount(comment?.reactionsCount || 0);
      info({
        content: resolveString('amity_social_toast_failed_generic'),
      });
    },
  });

  const { mutateAsync: mutateRemoveReactionAsync } = useMutation({
    mutationFn: async (reactionKey: string) => {
      setReactionByMe(null);
      return ReactionRepository.removeReaction('comment', comment?.commentId, reactionKey);
    },
    onMutate: () => {
      setShouldSubscribe(true);
      setReactionsCount(Math.max(0, reactionsCount - 1));
    },

    onError: () => {
      setReactionByMe(comment?.myReactions?.[0] || null);
      setReactionsCount(comment?.reactionsCount || 0);
      info({
        content: resolveString('amity_social_toast_failed_generic'),
      });
    },
  });

  return {
    reactionByMe,
    reactionsCount,
    mutateAddReactionAsync,
    mutateRemoveReactionAsync,
    setReactionByMe,
  };
};
