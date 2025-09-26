import { ReactionRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface UsePostReactionParams {
  post: Amity.Post;
}

interface UsePostReactionReturn {
  reactionByMe: string | null;
  reactionsCount: number;
  mutateAddReactionAsync: (reactionKey: string) => Promise<any>;
  mutateRemoveReactionAsync: (reactionKey: string) => Promise<any>;
  setReactionByMe: (reaction: string | null) => void;
}

export const usePostReaction = ({ post }: UsePostReactionParams): UsePostReactionReturn => {
  const [reactionsCount, setReactionsCount] = useState(0);
  const [shouldSubscribe, setShouldSubscribe] = useState(false);
  const [reactionByMe, setReactionByMe] = useState<string | null>(null);

  useEffect(() => {
    if (post == null) return;
    setReactionByMe(post.myReactions?.[0] || null);
  }, [post?.myReactions]);

  useEffect(() => {
    if (post == null) return;
    setReactionsCount(post?.reactionsCount || 0);
  }, [post?.reactionsCount]);

  const { mutateAsync: mutateAddReactionAsync } = useMutation({
    mutationFn: async (reactionKey: string) => {
      if (reactionByMe && reactionByMe !== reactionKey) {
        try {
          await ReactionRepository.removeReaction('post', post?.postId, reactionByMe);
        } catch (err) {
          console.error(err);
        }
      }
      return ReactionRepository.addReaction('post', post?.postId, reactionKey);
    },

    onMutate: (reactionKey) => {
      setShouldSubscribe(true);
      setReactionsCount(reactionsCount + 1);
      setReactionByMe(reactionKey);
    },
  });

  const { mutateAsync: mutateRemoveReactionAsync } = useMutation({
    mutationFn: async (reactionKey: string) => {
      return ReactionRepository.removeReaction('post', post?.postId, reactionKey);
    },
    onMutate: () => {
      setShouldSubscribe(true);
      setReactionsCount(Math.max(0, reactionsCount - 1));
      setReactionByMe(null);
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
